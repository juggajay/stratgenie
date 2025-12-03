import suburbsData from "@/content/data/suburbs.json";

export interface Suburb {
  slug: string;
  name: string;
  region: string;
  postcode: string;
  councilArea: string;
  description: string;
}

/**
 * Get all suburbs
 */
export function getAllSuburbs(): Suburb[] {
  return suburbsData.suburbs;
}

/**
 * Get a suburb by slug
 */
export function getSuburbBySlug(slug: string): Suburb | undefined {
  return suburbsData.suburbs.find((s) => s.slug === slug);
}

/**
 * Get suburbs by region
 */
export function getSuburbsByRegion(region: string): Suburb[] {
  return suburbsData.suburbs.filter((s) => s.region === region);
}

/**
 * Get all unique regions
 */
export function getAllRegions(): string[] {
  const regions = new Set(suburbsData.suburbs.map((s) => s.region));
  return Array.from(regions).sort();
}
