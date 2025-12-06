/**
 * SEO Meta Templates & Utilities
 * Quick-access templates for creating click-worthy metadata
 */

export interface MetaTemplateParams {
  primaryKeyword?: string;
  secondaryKeyword?: string;
  valueProp?: string;
  cta?: string;
  socialProof?: string;
  benefit?: string;
  problem?: string;
  solution?: string;
  metric?: string;
  location?: string;
  featureName?: string;
}

/**
 * TITLE TAG TEMPLATES
 * Pattern: [Keyword] | [Value] | Brand
 * Optimal: 50-60 characters
 */
export const titleTemplates = {
  // Feature + Benefit + Brand
  featureBenefitBrand: (params: MetaTemplateParams): string => {
    const { primaryKeyword, valueProp = "Stay Compliant", featureName } = params;
    return `${featureName || primaryKeyword} | ${valueProp} | StrataGenie`;
  },

  // Problem → Solution | Brand
  problemSolution: (params: MetaTemplateParams): string => {
    const { problem, solution } = params;
    return `${problem} → ${solution} | StrataGenie`;
  },

  // Emotional Hook + Feature | Brand
  emotionalHook: (params: MetaTemplateParams): string => {
    const { featureName, valueProp = "Compliance" } = params;
    return `Finally, Stress-Free ${featureName || valueProp} | StrataGenie`;
  },

  // Number + Adjective + Solution
  numberDriven: (params: MetaTemplateParams): string => {
    const { metric, valueProp, primaryKeyword } = params;
    return `${metric} ${valueProp || primaryKeyword} | StrataGenie`;
  },

  // Location + Service | Brand (for local pages)
  locationService: (params: MetaTemplateParams): string => {
    const { primaryKeyword, location } = params;
    return `${primaryKeyword} in ${location} | StrataGenie`;
  },

  // Tool name + Outcome
  toolOutcome: (params: MetaTemplateParams): string => {
    const { featureName, benefit } = params;
    return `${featureName} | ${benefit || "Free Tool"} | StrataGenie`;
  },

  // Comparison page
  comparison: (params: MetaTemplateParams): string => {
    const { primaryKeyword, metric = "70% Cheaper" } = params;
    return `StrataGenie vs ${primaryKeyword} | ${metric} | StrataGenie`;
  },

  // Generic fallback
  generic: (params: MetaTemplateParams): string => {
    const { primaryKeyword, valueProp = "Compliance" } = params;
    return `${primaryKeyword} | ${valueProp} | StrataGenie`;
  },
};

/**
 * META DESCRIPTION TEMPLATES
 * Pattern: [Hook] [Solution] [Proof] [CTA]
 * Optimal: 150-160 characters
 */
export const descriptionTemplates = {
  // Problem-Solve-Proof-CTA
  problemSolveProof: (params: MetaTemplateParams): string => {
    const {
      problem = "Struggling with strata compliance",
      solution = "StrataGenie automates your workflow",
      socialProof = "500+ NSW schemes trust us",
      cta = "Start free today",
    } = params;
    const desc = `${problem}? ${solution}. ${socialProof}. ${cta}.`;
    return desc.length <= 160 ? desc : desc.substring(0, 157) + "...";
  },

  // Feature-Benefit-Proof-CTA
  featureBenefitProof: (params: MetaTemplateParams): string => {
    const {
      featureName = "Our tool",
      benefit = "saves hours",
      socialProof = "Join 500+ schemes",
      cta = "Try now",
    } = params;
    const desc = `${featureName} ${benefit}. ${socialProof}. ${cta}.`;
    return desc.length <= 160 ? desc : desc.substring(0, 157) + "...";
  },

  // Question-Answer-CTA
  questionAnswer: (params: MetaTemplateParams): string => {
    const {
      problem = "When is your AGM due",
      solution = "Our calendar tracks deadlines",
      benefit = "Never miss a notice period",
      cta = "Learn more",
    } = params;
    const desc = `${problem}? ${solution}. ${benefit}. ${cta}.`;
    return desc.length <= 160 ? desc : desc.substring(0, 157) + "...";
  },

  // Comparison format
  comparison: (params: MetaTemplateParams): string => {
    const {
      problem = "Traditional managers cost $2,500-$10,000",
      solution = "StrataGenie from $14.99/lot/month",
      benefit = "Same compliance, fraction of cost",
      cta = "Compare now",
    } = params;
    const desc = `${problem}. ${solution}. ${benefit}. ${cta}.`;
    return desc.length <= 160 ? desc : desc.substring(0, 157) + "...";
  },

  // Authority-Social-CTA (testimonial style)
  authoritySocial: (params: MetaTemplateParams): string => {
    const {
      metric = "98% compliance rate",
      benefit = "saves our committee hours",
      socialProof = "500+ NSW schemes",
      cta = "Start free trial",
    } = params;
    const desc = `${metric}. ${benefit}. Trusted by ${socialProof}. ${cta}.`;
    return desc.length <= 160 ? desc : desc.substring(0, 157) + "...";
  },

  // Location-specific
  locationSpecific: (params: MetaTemplateParams): string => {
    const {
      location = "Sydney",
      benefit = "Save $2,000+ per year",
      solution = "AI compliance, no manager",
      cta = "Start free",
    } = params;
    const desc = `${location} strata schemes ${benefit}. ${solution}. ${cta}.`;
    return desc.length <= 160 ? desc : desc.substring(0, 157) + "...";
  },

  // Generic fallback
  generic: (params: MetaTemplateParams): string => {
    const {
      primaryKeyword = "Strata compliance",
      benefit = "automated",
      cta = "Learn more",
    } = params;
    const desc = `${primaryKeyword} made ${benefit}. Join 500+ NSW schemes. ${cta}.`;
    return desc.length <= 160 ? desc : desc.substring(0, 157) + "...";
  },
};

/**
 * URL SLUG TEMPLATES
 * Formats: kebab-case, lowercase, hyphens only
 */
export const slugTemplates = {
  // Blog post: [verb]-[noun]-[specificity]-[year?]
  blogPost: (title: string, year?: number): string => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Remove double hyphens
      .trim();

    return year ? `${slug}-${year}` : slug;
  },

  // Guide: [main-topic]-[subtopic]
  guide: (mainTopic: string, subTopic: string): string => {
    const main = mainTopic
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    const sub = subTopic
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    return `${main}-${sub}`;
  },

  // Tool: [noun]-[tool-type]
  tool: (name: string, type = "calculator"): string => {
    const toolName = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    return `${toolName}-${type}`;
  },

  // Location: [suburb-or-area]
  location: (suburb: string): string => {
    return suburb
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  },

  // Product/Agent: [product-name]
  product: (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  },
};

/**
 * POWER WORDS BY CATEGORY
 * For crafting emotionally resonant titles/descriptions
 */
export const powerWords = {
  trustAuthority: [
    "Master",
    "Proven",
    "Certified",
    "Official",
    "Expert",
    "Trusted",
    "Verified",
    "Authoritative",
  ],

  urgencyAction: [
    "Now",
    "Immediate",
    "Urgent",
    "Critical",
    "Essential",
    "Required",
    "Mandatory",
    "Due",
  ],

  simplicityRelief: [
    "Simple",
    "Easy",
    "Effortless",
    "Stress-Free",
    "Simplified",
    "Automated",
    "Streamlined",
    "Zero-Stress",
  ],

  efficiencySavings: [
    "Save",
    "Fast",
    "Quick",
    "Instant",
    "Automatic",
    "Efficient",
    "Faster",
    "Time-Saving",
  ],

  exclusivityVip: [
    "Exclusive",
    "Premium",
    "Elite",
    "Pro",
    "Advanced",
    "Smart",
    "Intelligent",
  ],

  positiveOutcomes: [
    "Success",
    "Compliant",
    "Protected",
    "Secure",
    "Confident",
    "Prepared",
    "Complete",
    "Perfect",
  ],
};

/**
 * EMOTIONAL TRIGGER PATTERNS
 * Structured patterns for high-converting copy
 */
export const emotionalTriggers = {
  // Pain avoidance (fear)
  painAvoidance: (penalty: string, solution: string): string => {
    return `Avoid ${penalty}. ${solution}.`;
  },

  // Aspiration (achievement)
  aspiration: (goal: string, solution: string): string => {
    return `Become ${goal}. ${solution}.`;
  },

  // Social proof (belonging)
  socialProof: (group: string, metric: string): string => {
    return `Join ${group}. ${metric} already here.`;
  },

  // Scarcity (limited time)
  scarcity: (offer: string, deadline: string): string => {
    return `Limited time: ${offer}. ${deadline}.`;
  },

  // Relief (problem solved)
  relief: (problem: string, solution: string): string => {
    return `Finally, ${solution} for ${problem}.`;
  },
};

/**
 * CTA FORMULAS
 * Specific, action-oriented call-to-action phrases
 */
type CtaCategory = "immediate" | "learning" | "action" | "comparison" | "validation";

const ctaData: Record<CtaCategory, string[]> = {
  immediate: [
    "Start free today",
    "Get started now",
    "Start your free trial",
    "Try now",
    "Start free",
  ],

  learning: [
    "Learn more",
    "Read guide",
    "Explore now",
    "Discover how",
    "See how it works",
  ],

  action: [
    "Calculate now",
    "Download free",
    "Get access",
    "Join now",
    "Sign up free",
  ],

  comparison: ["Compare features", "Compare pricing", "See the difference", "Learn why"],

  validation: ["View demo", "Watch video", "See examples", "Check it out"],
};

export const ctaOptions = {
  ...ctaData,
  random: (category: CtaCategory = "immediate"): string => {
    const options = ctaData[category];
    return options[Math.floor(Math.random() * options.length)];
  },
};

/**
 * METADATA VALIDATOR
 * Check title/description quality before publishing
 */
export interface MetadataValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100
}

export const validateMetadata = (
  title: string,
  description: string
): MetadataValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // Title validation
  if (!title || title.length === 0) {
    errors.push("Title is missing");
    score -= 20;
  }
  if (title.length < 30) {
    warnings.push("Title is too short (< 30 chars)");
    score -= 10;
  }
  if (title.length > 60) {
    warnings.push("Title may be truncated on mobile (> 60 chars)");
    score -= 5;
  }
  if (!title.includes("StrataGenie") && !title.includes("strata")) {
    warnings.push("Title lacks primary keyword");
    score -= 5;
  }
  if ((title.match(/\|/g) || []).length > 2) {
    warnings.push("Title has too many pipe separators");
    score -= 5;
  }

  // Description validation
  if (!description || description.length === 0) {
    errors.push("Description is missing");
    score -= 20;
  }
  if (description.length < 120) {
    warnings.push("Description is too short (< 120 chars)");
    score -= 10;
  }
  if (description.length > 160) {
    warnings.push("Description may be truncated (> 160 chars)");
    score -= 5;
  }
  if (!description.includes("StrataGenie") && !description.includes("strata")) {
    warnings.push("Description lacks primary keyword");
    score -= 5;
  }

  // CTA validation
  const ctaKeywords = [
    "start",
    "learn",
    "try",
    "get",
    "download",
    "explore",
    "join",
    "view",
    "see",
    "click",
  ];
  const hasCta = ctaKeywords.some((cta) =>
    description.toLowerCase().includes(cta)
  );
  if (!hasCta) {
    warnings.push("Description lacks clear CTA");
    score -= 5;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, score),
  };
};

/**
 * CHARACTER COUNTER
 * Help prevent truncation
 */
export const charUtils = {
  titleSafeLength: (title: string): "safe" | "short" | "long" => {
    const len = title.length;
    if (len < 30) return "short";
    if (len > 60) return "long";
    return "safe";
  },

  descriptionSafeLength: (desc: string): "safe" | "short" | "long" => {
    const len = desc.length;
    if (len < 120) return "short";
    if (len > 160) return "long";
    return "safe";
  },

  truncateDesc: (desc: string, maxChars = 160): string => {
    if (desc.length <= maxChars) return desc;
    return desc.substring(0, maxChars - 3) + "...";
  },

  getReadingEstimate: (text: string): number => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  },
};

/**
 * EXPORT METADATA AS JSON
 * For bulk optimization tracking
 */
export interface PageMetadata {
  url: string;
  title: string;
  description: string;
  slug: string;
  keywords?: string[];
  pageType: string;
  lastUpdated?: Date;
  validation?: MetadataValidation;
}

export const exportMetadataJson = (pages: PageMetadata[]): string => {
  return JSON.stringify(pages, null, 2);
};

/**
 * EXAMPLE USAGE
 */
export const exampleUsage = {
  createTitle: () => {
    const title = titleTemplates.featureBenefitBrand({
      featureName: "AGM Compliance Calendar",
      valueProp: "Never Miss Deadlines",
    });
    return title; // "AGM Compliance Calendar | Never Miss Deadlines | StrataGenie"
  },

  createDescription: () => {
    const desc = descriptionTemplates.problemSolveProof({
      problem: "Struggling with AGM deadlines",
      solution: "StrataGenie tracks every date automatically",
      socialProof: "500+ NSW schemes trust us",
      cta: "Start your free trial",
    });
    return desc;
  },

  createSlug: () => {
    const slug = slugTemplates.blogPost(
      "How to Run Your First AGM as a Self-Managed Strata",
      2025
    );
    return slug; // "how-to-run-your-first-agm-as-a-self-managed-strata-2025"
  },

  validatePage: () => {
    const validation = validateMetadata(
      "How to Run AGM for Self-Managed Strata | StrataGenie",
      "Learn step-by-step AGM compliance for NSW. 500+ schemes trust us. Free checklist. Start now."
    );
    return validation;
  },
};
