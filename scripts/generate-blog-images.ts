/**
 * Generate Blog Featured Images using Gemini API
 * Style: Flat vector illustrations matching Cyber-Magic dark theme
 * Run: npx tsx scripts/generate-blog-images.ts
 */

import * as fs from "fs";
import * as path from "path";

const GEMINI_MODEL = "gemini-2.0-flash-exp-image-generation";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const API_KEY = process.env.GOOGLE_GEMINI_API_KEY || "AIzaSyBbqRTDzD2M1GFFgv6y0VQqMdtu3SMRMdk";

interface BlogImageConfig {
  slug: string;
  title: string;
  prompt: string;
  category: "compliance" | "financial" | "self-managed" | "maintenance";
}

// Category color mapping for Cyber-Magic theme
const categoryColors = {
  compliance: { primary: "#06B6D4", name: "cyan" },      // Cyan
  financial: { primary: "#10B981", name: "emerald" },    // Emerald
  "self-managed": { primary: "#8B5CF6", name: "violet" }, // Violet
  maintenance: { primary: "#F59E0B", name: "amber" },    // Amber
};

const baseStylePrompt = `
Style requirements:
- Flat vector illustration style, clean and minimal
- Dark navy background (#0F172A to #1e293b gradient)
- Glowing accent elements with soft cyan (#06B6D4) highlights
- Professional and modern aesthetic
- No text, no words, no letters
- 1200x630 aspect ratio composition
- Subtle glassmorphism effects on key elements
- Clean lines, minimal detail, corporate professional feel
`;

// Existing 8 blog posts that need images
const existingPosts: BlogImageConfig[] = [
  {
    slug: "strata-hub-registration-guide",
    title: "NSW Strata Hub Registration",
    category: "compliance",
    prompt: `Create a flat vector illustration for a blog about NSW Strata Hub Registration.

Visual elements:
- A modern digital portal/gateway glowing with cyan light
- Government building silhouette integrated with digital interface
- Floating registration forms and checkmarks
- Abstract representation of data flowing into a secure hub
- Small apartment building icons connecting to the central portal

${baseStylePrompt}`,
  },
  {
    slug: "admin-fund-vs-capital-works-fund",
    title: "Admin Fund vs Capital Works Fund",
    category: "financial",
    prompt: `Create a flat vector illustration comparing two types of strata funds.

Visual elements:
- Two distinct glass containers or modern fund symbols side by side
- Left side: everyday items (light bulbs, cleaning supplies) representing admin
- Right side: building blocks, construction tools representing capital works
- Balance scale or comparison visual in the center
- Emerald green accents for financial theme
- Coins or money symbols flowing between sections

${baseStylePrompt}`,
  },
  {
    slug: "how-to-run-agm-self-managed-strata",
    title: "Running Your First AGM",
    category: "self-managed",
    prompt: `Create a flat vector illustration about running a strata AGM meeting.

Visual elements:
- Modern meeting room with people silhouettes around a table
- Floating agenda items and voting cards
- Gavel or meeting symbol with glowing effects
- Calendar showing meeting date
- Checklist floating nearby with checkmarks
- Violet/purple accents for self-managed theme

${baseStylePrompt}`,
  },
  {
    slug: "strata-maintenance-responsibilities",
    title: "Strata Maintenance Responsibilities",
    category: "maintenance",
    prompt: `Create a flat vector illustration about strata maintenance responsibilities.

Visual elements:
- Modern apartment building with sectioned areas highlighted
- Tools floating around (wrench, paintbrush, safety helmet)
- Maintenance checklist with glowing items
- Division between common property and lot areas
- Amber/orange accents for maintenance theme
- Workers or maintenance symbols

${baseStylePrompt}`,
  },
  {
    slug: "financial-hardship-information-statement-strata",
    title: "Financial Hardship Statement",
    category: "compliance",
    prompt: `Create a flat vector illustration about financial hardship support in strata.

Visual elements:
- Supportive hands reaching out with glowing cyan light
- Document or form with financial symbols
- Heart or care symbol integrated with building icon
- Shield representing protection
- Abstract representation of assistance and support
- Soft, empathetic visual tone while remaining professional

${baseStylePrompt}`,
  },
  {
    slug: "strata-levy-payment-plans-nsw",
    title: "Levy Payment Plans",
    category: "financial",
    prompt: `Create a flat vector illustration about strata levy payment plans.

Visual elements:
- Calendar with payment milestones marked
- Money/coins being distributed across timeline
- Payment schedule visualization
- Building icon with dollar signs
- Emerald green financial accents
- Progress bar or timeline showing structured payments

${baseStylePrompt}`,
  },
  {
    slug: "strata-committee-mandatory-training-nsw",
    title: "Committee Training Requirements",
    category: "compliance",
    prompt: `Create a flat vector illustration about mandatory strata committee training.

Visual elements:
- Graduation cap or certificate with glowing effects
- People silhouettes in learning posture
- Books or digital learning modules
- Certification badge with checkmark
- Training modules floating in organized manner
- Cyan compliance theme accents

${baseStylePrompt}`,
  },
  {
    slug: "disclosure-of-insurance-commissions-strata",
    title: "Insurance Commission Disclosure",
    category: "compliance",
    prompt: `Create a flat vector illustration about insurance transparency in strata.

Visual elements:
- Magnifying glass revealing hidden information
- Insurance document with visible/transparent sections
- Shield with checkmark representing protection and honesty
- Money trail being made visible
- Light rays representing transparency and disclosure
- Clean, professional compliance-focused imagery

${baseStylePrompt}`,
  },
];

// New 20 blog posts to create
const newPosts: BlogImageConfig[] = [
  // Pillar 1: nsw-strata-compliance (5 posts)
  {
    slug: "common-property-vs-lot-property",
    title: "Common Property vs Lot Property",
    category: "compliance",
    prompt: `Create a flat vector illustration explaining common vs lot property.

Visual elements:
- Building cross-section showing clearly divided areas
- Common areas highlighted in one color (hallways, pool, gardens)
- Individual lot/apartment areas in another color
- Clear boundary lines with glowing effects
- Icons representing different property types
- Cyan compliance theme

${baseStylePrompt}`,
  },
  {
    slug: "strata-bylaws-explained",
    title: "Strata By-Laws Explained",
    category: "compliance",
    prompt: `Create a flat vector illustration about strata by-laws and rules.

Visual elements:
- Open rulebook or law document with glowing pages
- Icons representing common rules (pets, noise, parking)
- Gavel or legal symbol
- Building with rule symbols floating around it
- Checkmarks and X marks showing dos and don'ts
- Professional legal-themed imagery

${baseStylePrompt}`,
  },
  {
    slug: "strata-records-guide",
    title: "Strata Records Management",
    category: "compliance",
    prompt: `Create a flat vector illustration about strata record keeping.

Visual elements:
- Organized file folders and digital storage
- Clock or timeline showing retention periods
- Document icons with categories (financial, meeting, correspondence)
- Secure filing cabinet with glowing elements
- Search/retrieve functionality representation
- Clean organized data visualization

${baseStylePrompt}`,
  },
  {
    slug: "afss-annual-fire-safety-statement",
    title: "Annual Fire Safety Statement",
    category: "compliance",
    prompt: `Create a flat vector illustration about AFSS fire safety compliance.

Visual elements:
- Fire extinguisher and safety equipment icons
- Building with fire safety checkpoints highlighted
- Calendar showing annual deadline
- Certification document with fire safety symbol
- Evacuation plan or safety diagram
- Red/orange fire elements with cyan compliance accents

${baseStylePrompt}`,
  },
  {
    slug: "strata-meetings-notice-requirements",
    title: "Meeting Notice Requirements",
    category: "compliance",
    prompt: `Create a flat vector illustration about strata meeting notifications.

Visual elements:
- Calendar with meeting dates highlighted
- Notification bell with countdown timer
- Envelope or message icons flowing to recipients
- Clock showing notice periods (7 days, 14 days)
- Meeting agenda document
- Communication symbols

${baseStylePrompt}`,
  },
  // Pillar 2: strata-financial-management (5 posts)
  {
    slug: "strata-insurance-nsw-guide",
    title: "Strata Insurance Guide",
    category: "financial",
    prompt: `Create a flat vector illustration about strata insurance.

Visual elements:
- Shield protecting a building
- Insurance policy document with checkmarks
- Different coverage types (building, liability, contents)
- Umbrella protecting property elements
- Emerald financial accents
- Professional insurance-themed imagery

${baseStylePrompt}`,
  },
  {
    slug: "levy-arrears-nsw-strata",
    title: "Handling Levy Arrears",
    category: "financial",
    prompt: `Create a flat vector illustration about managing levy arrears.

Visual elements:
- Payment tracking dashboard
- Warning symbols transitioning to resolution
- Recovery process steps visualization
- Balance scale showing debt resolution
- Calendar with payment reminders
- Professional but empathetic financial imagery

${baseStylePrompt}`,
  },
  {
    slug: "special-levy-strata-nsw",
    title: "Special Levies in Strata",
    category: "financial",
    prompt: `Create a flat vector illustration about raising special levies.

Visual elements:
- Emergency or special fund container
- Building with major work needed (roof, facade)
- Voting hands or ballot box
- Money pooling together for major expense
- Construction or repair symbols
- Emerald financial theme

${baseStylePrompt}`,
  },
  {
    slug: "strata-audit-requirements",
    title: "Strata Financial Audit",
    category: "financial",
    prompt: `Create a flat vector illustration about financial audits.

Visual elements:
- Magnifying glass over financial documents
- Calculator and spreadsheet icons
- Audit checklist with verification marks
- Professional auditor silhouette
- Financial reports being examined
- Trust and verification symbols

${baseStylePrompt}`,
  },
  {
    slug: "budgeting-strata-scheme",
    title: "Strata Scheme Budgeting",
    category: "financial",
    prompt: `Create a flat vector illustration about creating strata budgets.

Visual elements:
- Pie chart showing budget allocation
- Calendar with budget planning timeline
- Categories (maintenance, insurance, admin) as segments
- Calculator and spreadsheet
- Building with budget items connected
- Emerald financial accents

${baseStylePrompt}`,
  },
  // Pillar 3: transition-to-self-managed (4 posts)
  {
    slug: "first-meeting-strata-committee",
    title: "First Committee Meeting",
    category: "self-managed",
    prompt: `Create a flat vector illustration about first strata committee meeting.

Visual elements:
- Welcome or start symbol with glowing effects
- Meeting table with new committee members
- Agenda items for first meeting
- Handshake or collaboration symbols
- Checklist of first meeting tasks
- Violet self-managed theme accents

${baseStylePrompt}`,
  },
  {
    slug: "transitioning-to-self-managed",
    title: "Transition to Self-Managed",
    category: "self-managed",
    prompt: `Create a flat vector illustration about transitioning from strata manager.

Visual elements:
- Arrow or path from managed to self-managed
- Handover of documents/keys symbolism
- Empowered committee members
- Checklist of transition steps
- Before/after comparison visual
- Professional transition imagery

${baseStylePrompt}`,
  },
  {
    slug: "strata-committee-roles",
    title: "Committee Roles Explained",
    category: "self-managed",
    prompt: `Create a flat vector illustration about strata committee positions.

Visual elements:
- Organizational chart with role icons
- Secretary, Treasurer, Chairperson symbols
- Team collaboration imagery
- Responsibilities flowing from each role
- Professional corporate team structure
- Violet accents for self-managed theme

${baseStylePrompt}`,
  },
  {
    slug: "small-scheme-self-management",
    title: "Small Scheme Self-Management",
    category: "self-managed",
    prompt: `Create a flat vector illustration about managing small strata schemes.

Visual elements:
- Small building (2-10 units) with glowing highlight
- Simplified management symbols
- Close-knit community representation
- Streamlined processes visual
- Personal touch elements
- Cozy but professional imagery

${baseStylePrompt}`,
  },
  // Pillar 4: maintenance-asset-management (4 posts)
  {
    slug: "capital-works-plan-guide",
    title: "10-Year Capital Works Plan",
    category: "maintenance",
    prompt: `Create a flat vector illustration about long-term capital works planning.

Visual elements:
- Timeline stretching 10 years with milestones
- Building with highlighted future work areas
- Fund growth visualization over time
- Major work items (roof, elevator, facade) as icons
- Planning calendar with project markers
- Amber maintenance theme

${baseStylePrompt}`,
  },
  {
    slug: "building-defects-nsw-strata",
    title: "Building Defects Rights",
    category: "maintenance",
    prompt: `Create a flat vector illustration about building defects in strata.

Visual elements:
- Building with identified defect areas
- Inspection magnifying glass
- Legal/rights documents
- Repair process visualization
- Builder warranty symbols
- Professional defect assessment imagery

${baseStylePrompt}`,
  },
  {
    slug: "emergency-repairs-strata",
    title: "Emergency Repairs",
    category: "maintenance",
    prompt: `Create a flat vector illustration about emergency strata repairs.

Visual elements:
- Urgent repair symbols (broken pipe, electrical issue)
- Fast response imagery with speed lines
- Emergency fund or quick payment
- Repair technician silhouette
- Clock showing urgency
- Red/amber urgent color accents

${baseStylePrompt}`,
  },
  {
    slug: "contractor-management-strata",
    title: "Managing Contractors",
    category: "maintenance",
    prompt: `Create a flat vector illustration about contractor management.

Visual elements:
- Contractor workers with tools
- Contract document with terms
- Quality checklist
- Building maintenance in progress
- Communication between committee and contractors
- Professional project management imagery

${baseStylePrompt}`,
  },
  // Pillar 5: 2025-nsw-strata-reforms (2 posts)
  {
    slug: "2025-strata-reforms-summary",
    title: "2025 NSW Strata Reforms",
    category: "compliance",
    prompt: `Create a flat vector illustration about 2025 strata law reforms.

Visual elements:
- New legislation document with 2025 date
- Change/transformation arrows
- Key reform areas as icons
- NSW state outline subtle integration
- Timeline showing implementation dates
- Modern reform/update imagery

${baseStylePrompt}`,
  },
  {
    slug: "sustainability-infrastructure-strata",
    title: "Strata Sustainability Rules",
    category: "maintenance",
    prompt: `Create a flat vector illustration about sustainability in strata.

Visual elements:
- Green building with eco elements
- Solar panels, EV charging stations
- Sustainability icons (recycling, energy efficiency)
- Plant/nature elements integrated with building
- Green energy flowing to building
- Environmental compliance imagery

${baseStylePrompt}`,
  },
];

async function generateImage(config: BlogImageConfig): Promise<boolean> {
  const color = categoryColors[config.category];
  console.log(`\n📸 Generating: ${config.title}`);
  console.log(`   Category: ${config.category} (${color.name})`);
  console.log(`   Slug: ${config.slug}`);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: config.prompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`   ❌ API Error: ${response.status} - ${errorText}`);
      return false;
    }

    const data = await response.json();

    if (data.error) {
      console.error(`   ❌ Gemini Error: ${data.error.message}`);
      return false;
    }

    // Extract image data
    const imagePart = data.candidates?.[0]?.content?.parts?.find(
      (part: any) => part.inlineData
    );

    if (!imagePart?.inlineData) {
      console.error(`   ❌ No image in response`);
      const textPart = data.candidates?.[0]?.content?.parts?.find(
        (part: any) => part.text
      );
      if (textPart?.text) {
        console.log(`   Response: ${textPart.text.substring(0, 200)}...`);
      }
      return false;
    }

    // Save image
    const outputDir = path.join(process.cwd(), "public", "images", "blog");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `${config.slug}.png`);
    const imageBuffer = Buffer.from(imagePart.inlineData.data, "base64");
    fs.writeFileSync(outputPath, imageBuffer);

    console.log(`   ✅ Saved: public/images/blog/${config.slug}.png`);
    return true;
  } catch (error) {
    console.error(`   ❌ Error: ${error}`);
    return false;
  }
}

async function generateBatch(
  configs: BlogImageConfig[],
  batchName: string
): Promise<number> {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🎨 Generating ${batchName} (${configs.length} images)`);
  console.log("=".repeat(60));

  let successCount = 0;

  for (const config of configs) {
    const success = await generateImage(config);
    if (success) successCount++;
    // Rate limiting - 3 seconds between requests
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  return successCount;
}

async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || "all";

  console.log("🖼️  Blog Featured Image Generator");
  console.log("🎨 Style: Flat Vector Illustrations (Cyber-Magic Theme)");
  console.log("=".repeat(60));

  let totalSuccess = 0;
  let totalImages = 0;

  if (mode === "existing" || mode === "all") {
    const success = await generateBatch(existingPosts, "Existing Posts");
    totalSuccess += success;
    totalImages += existingPosts.length;
  }

  if (mode === "new" || mode === "all") {
    const success = await generateBatch(newPosts, "New Posts");
    totalSuccess += success;
    totalImages += newPosts.length;
  }

  if (mode !== "existing" && mode !== "new" && mode !== "all") {
    // Single image mode - find by slug
    const allPosts = [...existingPosts, ...newPosts];
    const config = allPosts.find((p) => p.slug === mode);
    if (config) {
      const success = await generateImage(config);
      totalSuccess = success ? 1 : 0;
      totalImages = 1;
    } else {
      console.log(`❌ Unknown slug: ${mode}`);
      console.log(`\nUsage:`);
      console.log(`  npx tsx scripts/generate-blog-images.ts           # Generate all`);
      console.log(`  npx tsx scripts/generate-blog-images.ts existing  # Existing 8 posts`);
      console.log(`  npx tsx scripts/generate-blog-images.ts new       # New 20 posts`);
      console.log(`  npx tsx scripts/generate-blog-images.ts <slug>    # Single image`);
      return;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`✨ Complete! Generated ${totalSuccess}/${totalImages} images`);
  console.log(`📁 Images saved to: public/images/blog/`);
}

main().catch(console.error);
