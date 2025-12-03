import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const CONTENT_DIR = path.join(process.cwd(), "content");
const BLOG_DIR = path.join(CONTENT_DIR, "blog");

export interface PostFrontmatter {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  category: string;
  tags: string[];
  pillar?: string;
  featured?: boolean;
  image?: string;
  imageAlt?: string;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
}

export interface PostMeta {
  slug: string;
  frontmatter: PostFrontmatter;
  readingTime: string;
}

/**
 * Get all MDX files recursively from a directory
 */
function getMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMdxFiles(fullPath));
    } else if (entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Parse a single MDX file
 */
function parsePost(filePath: string): Post {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const frontmatter = data as PostFrontmatter;

  // Generate slug from file path
  const relativePath = path.relative(BLOG_DIR, filePath);
  const slug = relativePath
    .replace(/\.mdx$/, "")
    .replace(/\\/g, "/")
    .split("/")
    .pop() || "";

  return {
    slug,
    frontmatter,
    content,
    readingTime: readingTime(content).text,
  };
}

/**
 * Get all blog posts sorted by date (newest first)
 */
export async function getAllPosts(): Promise<PostMeta[]> {
  const files = getMdxFiles(BLOG_DIR);
  const posts = files.map((file) => {
    const post = parsePost(file);
    return {
      slug: post.slug,
      frontmatter: post.frontmatter,
      readingTime: post.readingTime,
    };
  });

  // Sort by date (newest first)
  return posts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.publishedAt);
    const dateB = new Date(b.frontmatter.publishedAt);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const files = getMdxFiles(BLOG_DIR);

  for (const file of files) {
    const post = parsePost(file);
    if (post.slug === slug) {
      return post;
    }
  }

  return null;
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(category: string): Promise<PostMeta[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.frontmatter.category === category);
}

/**
 * Get posts by pillar
 */
export async function getPostsByPillar(pillar: string): Promise<PostMeta[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.frontmatter.pillar === pillar);
}

/**
 * Get featured posts
 */
export async function getFeaturedPosts(limit = 3): Promise<PostMeta[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.frontmatter.featured).slice(0, limit);
}

/**
 * Get all unique categories
 */
export async function getAllCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  const categories = new Set(posts.map((post) => post.frontmatter.category));
  return Array.from(categories);
}

/**
 * Get all unique tags
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = new Set(posts.flatMap((post) => post.frontmatter.tags));
  return Array.from(tags);
}

/**
 * Get related posts based on category and tags
 */
export async function getRelatedPosts(
  currentSlug: string,
  limit = 3
): Promise<PostMeta[]> {
  const currentPost = await getPostBySlug(currentSlug);
  if (!currentPost) return [];

  const allPosts = await getAllPosts();
  const otherPosts = allPosts.filter((p) => p.slug !== currentSlug);

  // Score posts by relevance
  const scoredPosts = otherPosts.map((post) => {
    let score = 0;

    // Same category: +3
    if (post.frontmatter.category === currentPost.frontmatter.category) {
      score += 3;
    }

    // Same pillar: +4
    if (
      post.frontmatter.pillar &&
      post.frontmatter.pillar === currentPost.frontmatter.pillar
    ) {
      score += 4;
    }

    // Shared tags: +2 each
    const sharedTags = post.frontmatter.tags.filter((tag) =>
      currentPost.frontmatter.tags.includes(tag)
    );
    score += sharedTags.length * 2;

    return { post, score };
  });

  // Sort by score and return top posts
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}
