import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users - synced from Clerk auth (CH-0008)
  users: defineTable({
    tokenIdentifier: v.string(), // Clerk user ID (e.g., "https://clerk.xxx|user_xxx")
    email: v.string(),
    name: v.optional(v.string()),
    createdAt: v.number(), // timestamp
    lastLoginAt: v.number(), // timestamp
  })
    .index("by_token", ["tokenIdentifier"]),

  // User-Scheme relationship (CH-0008)
  userSchemes: defineTable({
    userId: v.id("users"),
    schemeId: v.id("schemes"),
    role: v.union(v.literal("admin"), v.literal("member"), v.literal("viewer")),
    joinedAt: v.number(), // timestamp
  })
    .index("by_user", ["userId"])
    .index("by_scheme", ["schemeId"])
    .index("by_user_and_scheme", ["userId", "schemeId"]),

  // Strata scheme - the top-level tenant
  schemes: defineTable({
    // Basic info
    name: v.string(),
    strataNumber: v.string(), // e.g., "SP12345"
    address: v.optional(v.string()), // Scheme address

    // Committee details (CH-0002)
    secretaryName: v.optional(v.string()),
    secretaryEmail: v.optional(v.string()),

    // Default meeting details (CH-0002)
    defaultMeetingLocation: v.optional(v.string()),
    defaultMeetingTime: v.optional(v.string()), // e.g., "7:00 PM"

    // Compliance date tracking (CH-0001)
    lastAgmDate: v.optional(v.number()), // timestamp
    nextAgmDueDate: v.optional(v.number()), // derived: lastAgmDate + 1 year
    lastStrataHubReportDate: v.optional(v.number()), // timestamp
    nextStrataHubReportDueDate: v.optional(v.number()), // derived: lastAgmDate + 3 months

    // Scheme details
    lotCount: v.optional(v.number()), // Number of lots in the scheme

    // Trial/subscription tracking (CH-0008)
    trialEndsAt: v.optional(v.number()), // timestamp, null = paid/grandfathered
  })
    .index("by_strata_number", ["strataNumber"]),

  // Compliance tasks for AGM preparation (CH-0001)
  complianceTasks: defineTable({
    schemeId: v.id("schemes"),
    type: v.union(
      v.literal("send_agm_notice"),
      v.literal("hold_agm"),
      v.literal("file_strata_hub_report")
    ),
    title: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("in_progress"),
      v.literal("done")
    ),
    dueDate: v.number(), // timestamp
    completedAt: v.optional(v.number()), // timestamp when marked done
  })
    .index("by_scheme", ["schemeId"])
    .index("by_scheme_and_status", ["schemeId", "status"]),

  // Generated documents (CH-0002)
  documents: defineTable({
    schemeId: v.id("schemes"),
    type: v.union(
      v.literal("agm_notice"),
      v.literal("agm_minutes"),
      v.literal("levy_notice")
    ),
    status: v.union(v.literal("draft"), v.literal("final")),
    content: v.string(), // HTML content
    title: v.string(), // e.g., "AGM Notice - March 2026"
    createdAt: v.number(), // timestamp
    finalizedAt: v.optional(v.number()), // timestamp when marked final
  })
    .index("by_scheme", ["schemeId"])
    .index("by_scheme_and_type", ["schemeId", "type"]),

  // Uploaded invoices for AI extraction (CH-0003)
  invoices: defineTable({
    schemeId: v.id("schemes"),
    fileId: v.id("_storage"), // Convex file storage ID
    fileName: v.string(), // Original file name
    status: v.union(
      v.literal("processing"),
      v.literal("ready"),
      v.literal("failed")
    ),
    // Extracted data from AI (populated after processing)
    extractedData: v.optional(
      v.object({
        vendorName: v.optional(v.string()),
        invoiceDate: v.optional(v.string()), // ISO date string
        totalAmount: v.optional(v.int64()), // Amount in cents
        taxAmount: v.optional(v.int64()), // GST in cents
        description: v.optional(v.string()),
        category: v.optional(v.string()),
        confidence: v.optional(v.number()), // 0-1 confidence score
      })
    ),
    errorMessage: v.optional(v.string()), // Error message if extraction failed
    createdAt: v.number(), // timestamp
    extractedAt: v.optional(v.number()), // timestamp when extraction completed
  })
    .index("by_scheme", ["schemeId"])
    .index("by_scheme_and_status", ["schemeId", "status"]),

  // Financial transactions / ledger entries (CH-0003)
  transactions: defineTable({
    schemeId: v.id("schemes"),
    invoiceId: v.optional(v.id("invoices")), // Source invoice (optional)
    type: v.union(v.literal("expense"), v.literal("income")),
    amount: v.int64(), // Total amount in cents (AUD)
    gst: v.int64(), // GST component in cents (AUD)
    description: v.string(), // Human-readable description
    vendorName: v.optional(v.string()), // Vendor/payee name
    invoiceDate: v.optional(v.string()), // Date on invoice (ISO string)
    category: v.optional(
      v.union(
        v.literal("repairs"),
        v.literal("insurance"),
        v.literal("utilities"),
        v.literal("admin"),
        v.literal("cleaning"),
        v.literal("gardening"),
        v.literal("legal"),
        v.literal("other")
      )
    ),
    status: v.union(
      v.literal("draft"),
      v.literal("approved"),
      v.literal("paid")
    ),
    // Original AI extraction (preserved for audit)
    originalExtraction: v.optional(
      v.object({
        totalAmount: v.int64(),
        taxAmount: v.int64(),
        vendorName: v.optional(v.string()),
        description: v.optional(v.string()),
      })
    ),
    createdAt: v.number(), // timestamp
    approvedAt: v.optional(v.number()), // timestamp when approved
    approvedBy: v.optional(v.string()), // User ID who approved
  })
    .index("by_scheme", ["schemeId"])
    .index("by_scheme_and_status", ["schemeId", "status"])
    .index("by_invoice", ["invoiceId"]),

  // Uploaded bylaw documents for Guardian Agent (CH-0004)
  bylaws: defineTable({
    schemeId: v.id("schemes"),
    fileId: v.id("_storage"), // Convex file storage ID
    fileName: v.string(), // Original file name
    status: v.union(
      v.literal("processing"),
      v.literal("ready"),
      v.literal("failed")
    ),
    errorMessage: v.optional(v.string()), // Error message if processing failed
    totalChunks: v.optional(v.number()), // Number of chunks created
    createdAt: v.number(), // timestamp
    processedAt: v.optional(v.number()), // timestamp when processing completed
  })
    .index("by_scheme", ["schemeId"])
    .index("by_scheme_and_status", ["schemeId", "status"]),

  // Vectorized chunks of bylaw documents (CH-0004)
  bylawChunks: defineTable({
    schemeId: v.id("schemes"), // Denormalized for efficient filtering
    bylawId: v.id("bylaws"), // Reference to parent bylaw
    chunkIndex: v.number(), // Order in document (0-based)
    text: v.string(), // Text content (~1000 chars)
    embedding: v.array(v.float64()), // Vector embedding (1536 dimensions)
    sectionHeader: v.optional(v.string()), // Detected section header if available
  })
    .index("by_scheme", ["schemeId"])
    .index("by_bylaw", ["bylawId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["schemeId"],
    }),

  // Lots - individual units/apartments in a strata scheme (CH-0005)
  lots: defineTable({
    schemeId: v.id("schemes"),
    lotNumber: v.string(), // e.g., "1", "2A", "G01"
    unitEntitlement: v.number(), // integer representing share of scheme costs
    ownerName: v.string(), // current owner's name
    ownerEmail: v.string(), // owner's email for notices
    ownerAddress: v.optional(v.string()), // mailing address
    createdAt: v.number(), // timestamp
  })
    .index("by_scheme", ["schemeId"])
    .index("by_scheme_and_lot", ["schemeId", "lotNumber"]),

  // Levy runs - bulk billing events (CH-0005)
  levyRuns: defineTable({
    schemeId: v.id("schemes"),
    fundType: v.union(v.literal("admin"), v.literal("capital_works")),
    totalAmount: v.int64(), // budget in cents (AUD)
    periodLabel: v.string(), // e.g., "Q1 2026"
    periodStart: v.number(), // timestamp
    periodEnd: v.number(), // timestamp
    dueDate: v.number(), // payment due date timestamp
    status: v.union(v.literal("draft"), v.literal("issued")),
    createdAt: v.number(), // timestamp
  })
    .index("by_scheme", ["schemeId"])
    .index("by_scheme_and_status", ["schemeId", "status"]),

  // Levy invoices - individual lot bills (CH-0005)
  levyInvoices: defineTable({
    schemeId: v.id("schemes"),
    levyRunId: v.id("levyRuns"),
    lotId: v.id("lots"),
    amount: v.int64(), // calculated levy amount in cents (AUD)
    status: v.union(v.literal("pending"), v.literal("sent"), v.literal("paid")),
    sentAt: v.optional(v.number()), // timestamp when notice distributed
    paidAt: v.optional(v.number()), // timestamp when payment received
    createdAt: v.number(), // timestamp
  })
    .index("by_scheme", ["schemeId"])
    .index("by_levy_run", ["levyRunId"])
    .index("by_lot", ["lotId"]),

  // Strata Hub Reporter - AI document analysis for public users (CH-0009)
  strataHubReports: defineTable({
    sessionId: v.string(), // Browser session ID for anonymous access
    status: v.union(
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    fileId: v.id("_storage"), // Reference to uploaded PDF
    fileName: v.optional(v.string()), // Original file name
    extractedData: v.optional(
      v.object({
        strataPlanNumber: v.optional(v.string()),
        lastAfssDate: v.optional(v.string()), // ISO format YYYY-MM-DD
        capitalWorksFundBalance: v.optional(v.int64()), // Cents (AUD)
        adminFundBalance: v.optional(v.int64()), // Cents (AUD)
        insuranceReplacementValue: v.optional(v.int64()), // Cents (AUD)
        lastAgmDate: v.optional(v.string()), // ISO format YYYY-MM-DD
        totalLots: v.optional(v.number()),
      })
    ),
    unlocked: v.boolean(), // Whether user has provided email
    errorMessage: v.optional(v.string()),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_session", ["sessionId"])
    .index("by_status", ["status"]),

  // Marketing leads from free tools (SEO)
  leads: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    source: v.union(
      v.literal("strata_roll_template"),
      v.literal("compliance_health_check"),
      v.literal("newsletter"),
      v.literal("levy_calculator"),
      v.literal("strata_hub_reporter")
    ),
    metadata: v.optional(
      v.object({
        score: v.optional(v.number()), // Health check score
        answers: v.optional(v.array(v.string())), // Quiz answers
        calculatorInputs: v.optional(
          v.object({
            totalBudget: v.optional(v.number()),
            unitEntitlement: v.optional(v.number()),
            totalEntitlements: v.optional(v.number()),
          })
        ),
      })
    ),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_source", ["source"]),
});
