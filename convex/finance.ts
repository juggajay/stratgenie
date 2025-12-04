import { v } from "convex/values";
import { mutation, query, action, internalQuery, internalMutation } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { checkAccess, requireRole } from "./lib/permissions";
import {
  inferFundFromCategory,
  getStatutoryExpenseCategory,
  createEmptyFinancialStats,
  type TransactionCategory,
  type FundType,
} from "./lib/financialReporting";

// ============================================================================
// Invoice Queries
// ============================================================================

/**
 * List all invoices for a scheme, sorted by creation date (newest first).
 */
export const listInvoicesForScheme = query({
  args: {
    schemeId: v.id("schemes"),
  },
  handler: async (ctx, args) => {
    // Get the scheme - matches getScheme behavior (no auth check for reading)
    

    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_scheme", (q) => q.eq("schemeId", args.schemeId))
      .collect();

    return invoices.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Get a single invoice by ID.
 */
export const getInvoice = query({
  args: {
    invoiceId: v.id("invoices"),
  },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice) return null;

    // Get the scheme - matches getScheme behavior (no auth check for reading)
    await checkAccess(ctx, invoice.schemeId);

    // Get the file URL
    const fileUrl = await ctx.storage.getUrl(invoice.fileId);

    return {
      ...invoice,
      fileUrl,
    };
  },
});

/**
 * Get a single invoice by ID (internal - no auth check).
 * Used by scheduled actions that run without user context.
 */
export const getInvoiceInternal = internalQuery({
  args: {
    invoiceId: v.id("invoices"),
  },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice) return null;

    // Get the file URL
    const fileUrl = await ctx.storage.getUrl(invoice.fileId);

    return {
      ...invoice,
      fileUrl,
    };
  },
});

// ============================================================================
// Invoice Mutations
// ============================================================================

/**
 * Generate an upload URL for a new invoice file.
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Allowed file extensions for invoice uploads
const ALLOWED_INVOICE_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg"];
const MAX_FILENAME_LENGTH = 255;

/**
 * Create an invoice record after file upload.
 * This triggers the extraction process.
 */
export const createInvoice = mutation({
  args: {
    schemeId: v.id("schemes"),
    fileId: v.id("_storage"),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify user has member role for this scheme
    await requireRole(ctx, args.schemeId, "member");

    // Validate filename length to prevent abuse
    if (args.fileName.length > MAX_FILENAME_LENGTH) {
      throw new Error("Filename too long");
    }

    // Validate file extension
    const fileNameLower = args.fileName.toLowerCase();
    const hasValidExtension = ALLOWED_INVOICE_EXTENSIONS.some((ext) =>
      fileNameLower.endsWith(ext)
    );
    if (!hasValidExtension) {
      throw new Error(
        `Invalid file type. Allowed types: ${ALLOWED_INVOICE_EXTENSIONS.join(", ")}`
      );
    }

    // Validate scheme exists
    const scheme = await ctx.db.get(args.schemeId);
    if (!scheme) {
      return null;
    }

    // Create invoice record with processing status
    const invoiceId = await ctx.db.insert("invoices", {
      schemeId: args.schemeId,
      fileId: args.fileId,
      fileName: args.fileName,
      status: "processing",
      createdAt: Date.now(),
    });

    // Schedule the extraction action
    await ctx.scheduler.runAfter(0, api.finance.processInvoiceExtraction, {
      invoiceId,
    });

    return invoiceId;
  },
});

/**
 * Process invoice extraction - called after upload.
 * Fetches the file, calls OpenAI, and creates a draft transaction.
 */
export const processInvoiceExtraction = action({
  args: {
    invoiceId: v.id("invoices"),
  },
  handler: async (ctx, args) => {
    // Get the invoice using internal query (no auth check needed for scheduled actions)
    const invoice = await ctx.runQuery(internal.finance.getInvoiceInternal, {
      invoiceId: args.invoiceId,
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    if (!invoice.fileUrl) {
      // Mark as failed
      await ctx.runMutation(internal.finance.updateInvoiceStatusInternal, {
        invoiceId: args.invoiceId,
        status: "failed",
        errorMessage: "Could not get file URL",
      });
      return;
    }

    // Call OpenAI extraction with fileName for proper PDF detection
    const result = await ctx.runAction(api.actions.openai.extractInvoiceData, {
      fileUrl: invoice.fileUrl,
      fileName: invoice.fileName,
    });

    if (!result.success) {
      // Mark invoice as failed
      await ctx.runMutation(internal.finance.updateInvoiceStatusInternal, {
        invoiceId: args.invoiceId,
        status: "failed",
        errorMessage: result.error || "Extraction failed",
      });
      return;
    }

    // Extract data (TypeScript narrowing after success check)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (result as any).data as {
      vendorName: string | null;
      invoiceDate: string | null;
      totalAmount: number | null;
      taxAmount: number | null;
      description: string | null;
      category: string | null;
      confidence: number;
    };

    // Update invoice with extracted data
    await ctx.runMutation(internal.finance.updateInvoiceWithExtractionInternal, {
      invoiceId: args.invoiceId,
      extractedData: {
        vendorName: data.vendorName || undefined,
        invoiceDate: data.invoiceDate || undefined,
        totalAmount: data.totalAmount ? BigInt(data.totalAmount) : undefined,
        taxAmount: data.taxAmount ? BigInt(data.taxAmount) : undefined,
        description: data.description || undefined,
        category: data.category || undefined,
        confidence: data.confidence || undefined,
      },
    });

    // Create a draft transaction if we have valid data
    if (data.totalAmount) {
      await ctx.runMutation(internal.finance.createTransactionFromInvoiceInternal, {
        invoiceId: args.invoiceId,
        schemeId: invoice.schemeId,
        vendorName: data.vendorName || undefined,
        invoiceDate: data.invoiceDate || undefined,
        amount: BigInt(data.totalAmount),
        gst: BigInt(data.taxAmount || 0),
        description: data.description || `Invoice from ${data.vendorName || "Unknown"}`,
        category: data.category || undefined,
      });
    }
  },
});

/**
 * Update invoice status (internal use - for scheduled actions).
 */
export const updateInvoiceStatusInternal = internalMutation({
  args: {
    invoiceId: v.id("invoices"),
    status: v.union(
      v.literal("processing"),
      v.literal("ready"),
      v.literal("failed")
    ),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.invoiceId, {
      status: args.status,
      errorMessage: args.errorMessage,
      extractedAt: Date.now(),
    });
  },
});

/**
 * Update invoice with extraction results (internal use - for scheduled actions).
 */
export const updateInvoiceWithExtractionInternal = internalMutation({
  args: {
    invoiceId: v.id("invoices"),
    extractedData: v.object({
      vendorName: v.optional(v.string()),
      invoiceDate: v.optional(v.string()),
      totalAmount: v.optional(v.int64()),
      taxAmount: v.optional(v.int64()),
      description: v.optional(v.string()),
      category: v.optional(v.string()),
      confidence: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.invoiceId, {
      status: "ready",
      extractedData: args.extractedData,
      extractedAt: Date.now(),
    });
  },
});

/**
 * Delete an invoice (for dismissing failed uploads).
 */
export const deleteInvoice = mutation({
  args: {
    invoiceId: v.id("invoices"),
  },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Verify user has member role for this scheme
    await requireRole(ctx, invoice.schemeId, "member");

    // Delete the file from storage
    await ctx.storage.delete(invoice.fileId);

    // Delete the invoice record
    await ctx.db.delete(args.invoiceId);

    return { success: true };
  },
});

// ============================================================================
// Transaction Queries
// ============================================================================

/**
 * List all transactions for a scheme, sorted by creation date (newest first).
 */
export const listTransactionsForScheme = query({
  args: {
    schemeId: v.id("schemes"),
    status: v.optional(
      v.union(v.literal("draft"), v.literal("approved"), v.literal("paid"))
    ),
  },
  handler: async (ctx, args) => {
    // Get the scheme - matches getScheme behavior (no auth check for reading)
    

    let transactions;

    if (args.status) {
      transactions = await ctx.db
        .query("transactions")
        .withIndex("by_scheme_and_status", (q) =>
          q.eq("schemeId", args.schemeId).eq("status", args.status!)
        )
        .collect();
    } else {
      transactions = await ctx.db
        .query("transactions")
        .withIndex("by_scheme", (q) => q.eq("schemeId", args.schemeId))
        .collect();
    }

    return transactions.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Get a single transaction by ID.
 */
export const getTransaction = query({
  args: {
    transactionId: v.id("transactions"),
  },
  handler: async (ctx, args) => {
    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) return null;

    // Get the scheme - matches getScheme behavior (no auth check for reading)
    await checkAccess(ctx, transaction.schemeId);

    return transaction;
  },
});

/**
 * Get transaction count by status for a scheme.
 */
export const getTransactionCounts = query({
  args: {
    schemeId: v.id("schemes"),
  },
  handler: async (ctx, args) => {
    // Get the scheme - matches getScheme behavior (no auth check for reading)
    

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_scheme", (q) => q.eq("schemeId", args.schemeId))
      .collect();

    return {
      draft: transactions.filter((t) => t.status === "draft").length,
      approved: transactions.filter((t) => t.status === "approved").length,
      paid: transactions.filter((t) => t.status === "paid").length,
      total: transactions.length,
    };
  },
});

// ============================================================================
// Transaction Mutations
// ============================================================================

/**
 * Create a transaction from an extracted invoice (internal use - for scheduled actions).
 */
export const createTransactionFromInvoiceInternal = internalMutation({
  args: {
    invoiceId: v.id("invoices"),
    schemeId: v.id("schemes"),
    vendorName: v.optional(v.string()),
    invoiceDate: v.optional(v.string()),
    amount: v.int64(),
    gst: v.int64(),
    description: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate category if provided
    const validCategories = [
      "repairs",
      "insurance",
      "utilities",
      "admin",
      "cleaning",
      "gardening",
      "legal",
      "other",
    ];
    const category =
      args.category && validCategories.includes(args.category)
        ? (args.category as
            | "repairs"
            | "insurance"
            | "utilities"
            | "admin"
            | "cleaning"
            | "gardening"
            | "legal"
            | "other")
        : undefined;

    const transactionId = await ctx.db.insert("transactions", {
      schemeId: args.schemeId,
      invoiceId: args.invoiceId,
      type: "expense",
      amount: args.amount,
      gst: args.gst,
      description: args.description,
      vendorName: args.vendorName,
      invoiceDate: args.invoiceDate,
      category,
      status: "draft",
      originalExtraction: {
        totalAmount: args.amount,
        taxAmount: args.gst,
        vendorName: args.vendorName,
        description: args.description,
      },
      createdAt: Date.now(),
    });

    return transactionId;
  },
});

/**
 * Update a draft transaction (allows editing before approval).
 */
export const updateTransaction = mutation({
  args: {
    transactionId: v.id("transactions"),
    amount: v.optional(v.int64()),
    gst: v.optional(v.int64()),
    description: v.optional(v.string()),
    vendorName: v.optional(v.string()),
    invoiceDate: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Verify user has member role for this scheme
    await requireRole(ctx, transaction.schemeId, "member");

    if (transaction.status !== "draft") {
      throw new Error("Can only edit draft transactions");
    }

    const updates: Record<string, unknown> = {};
    if (args.amount !== undefined) updates.amount = args.amount;
    if (args.gst !== undefined) updates.gst = args.gst;
    if (args.description !== undefined) updates.description = args.description;
    if (args.vendorName !== undefined) updates.vendorName = args.vendorName;
    if (args.invoiceDate !== undefined) updates.invoiceDate = args.invoiceDate;
    if (args.category !== undefined) updates.category = args.category;

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(args.transactionId, updates);
    }

    return { success: true };
  },
});

/**
 * Approve a draft transaction.
 */
export const approveTransaction = mutation({
  args: {
    transactionId: v.id("transactions"),
    approvedBy: v.optional(v.string()), // User ID
  },
  handler: async (ctx, args) => {
    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Verify user has admin role (only admins can approve)
    const { userId } = await requireRole(ctx, transaction.schemeId, "admin");

    if (transaction.status !== "draft") {
      throw new Error("Can only approve draft transactions");
    }

    await ctx.db.patch(args.transactionId, {
      status: "approved",
      approvedAt: Date.now(),
      approvedBy: args.approvedBy || userId,
    });

    return { success: true };
  },
});

/**
 * Mark an approved transaction as paid.
 */
export const markTransactionPaid = mutation({
  args: {
    transactionId: v.id("transactions"),
  },
  handler: async (ctx, args) => {
    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Verify user has member role for this scheme
    await requireRole(ctx, transaction.schemeId, "member");

    if (transaction.status !== "approved") {
      throw new Error("Can only mark approved transactions as paid");
    }

    await ctx.db.patch(args.transactionId, {
      status: "paid",
    });

    return { success: true };
  },
});

/**
 * Delete a draft transaction.
 */
export const deleteTransaction = mutation({
  args: {
    transactionId: v.id("transactions"),
  },
  handler: async (ctx, args) => {
    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Verify user has member role for this scheme
    await requireRole(ctx, transaction.schemeId, "member");

    if (transaction.status !== "draft") {
      throw new Error("Can only delete draft transactions");
    }

    await ctx.db.delete(args.transactionId);

    return { success: true };
  },
});

// ============================================================================
// Statutory Financial Reporting (CH-0012)
// ============================================================================

/**
 * Get aggregated financial statistics for statutory reporting.
 * Aggregates approved transactions by fund and category for a date range.
 */
export const getFinancialStats = query({
  args: {
    schemeId: v.id("schemes"),
    startDate: v.number(), // timestamp
    endDate: v.number(), // timestamp
  },
  handler: async (ctx, args) => {
    // Get the scheme - matches getScheme behavior (no auth check for reading)
    

    // Get all approved transactions in the date range
    const allTransactions = await ctx.db
      .query("transactions")
      .withIndex("by_scheme_and_status", (q) =>
        q.eq("schemeId", args.schemeId).eq("status", "approved")
      )
      .collect();

    // Filter by date range (using invoiceDate or createdAt)
    const transactions = allTransactions.filter((t) => {
      const txDate = t.invoiceDate
        ? new Date(t.invoiceDate).getTime()
        : t.createdAt;
      return txDate >= args.startDate && txDate <= args.endDate;
    });

    // Initialize stats
    const stats = createEmptyFinancialStats(args.startDate, args.endDate);
    stats.transactionCount = transactions.length;

    // Aggregate transactions
    for (const tx of transactions) {
      // Determine fund (use explicit fund or infer from category)
      const fund: FundType =
        tx.fund || inferFundFromCategory(tx.category as TransactionCategory);
      const fundStats =
        fund === "admin" ? stats.adminFund : stats.capitalWorksFund;

      if (tx.type === "income") {
        // For now, all income is categorized as "other" unless we add income types
        fundStats.income.other += tx.amount;
        fundStats.income.total += tx.amount;
      } else {
        // Expense - categorize by statutory category
        const category = getStatutoryExpenseCategory(
          tx.category as TransactionCategory,
          fund
        );

        // Add to category (create if doesn't exist)
        if (!fundStats.expense[category]) {
          fundStats.expense[category] = 0n;
        }
        fundStats.expense[category] += tx.amount;
        fundStats.expense.total += tx.amount;
      }
    }

    return stats;
  },
});

/**
 * Get scheme financial settings including opening balances.
 */
export const getSchemeFinancialSettings = query({
  args: {
    schemeId: v.id("schemes"),
  },
  handler: async (ctx, args) => {
    // Get the scheme - matches getScheme behavior (no auth check for reading)
    

    const scheme = await ctx.db.get(args.schemeId);
    if (!scheme) {
      return null;
    }

    return {
      openingBalanceAdmin: scheme.openingBalanceAdmin,
      openingBalanceCapital: scheme.openingBalanceCapital,
      financialYearEnd: scheme.financialYearEnd || "06-30",
    };
  },
});

/**
 * Update scheme financial settings (opening balances).
 */
export const updateSchemeFinancialSettings = mutation({
  args: {
    schemeId: v.id("schemes"),
    openingBalanceAdmin: v.optional(v.int64()),
    openingBalanceCapital: v.optional(v.int64()),
    financialYearEnd: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verify user has admin role for this scheme
    await requireRole(ctx, args.schemeId, "admin");

    const updates: Record<string, unknown> = {};

    if (args.openingBalanceAdmin !== undefined) {
      updates.openingBalanceAdmin = args.openingBalanceAdmin;
    }
    if (args.openingBalanceCapital !== undefined) {
      updates.openingBalanceCapital = args.openingBalanceCapital;
    }
    if (args.financialYearEnd !== undefined) {
      // Validate format MM-DD
      if (!/^\d{2}-\d{2}$/.test(args.financialYearEnd)) {
        throw new Error("Financial year end must be in MM-DD format");
      }
      updates.financialYearEnd = args.financialYearEnd;
    }

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(args.schemeId, updates);
    }

    return { success: true };
  },
});

/**
 * Backfill fund field on existing transactions based on category.
 * This is a migration helper for CH-0012.
 */
export const backfillTransactionFunds = mutation({
  args: {
    schemeId: v.id("schemes"),
  },
  handler: async (ctx, args) => {
    // Verify user has admin role
    await requireRole(ctx, args.schemeId, "admin");

    // Get all transactions without a fund field
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_scheme", (q) => q.eq("schemeId", args.schemeId))
      .collect();

    let updated = 0;
    for (const tx of transactions) {
      if (tx.fund === undefined) {
        const inferredFund = inferFundFromCategory(
          tx.category as TransactionCategory
        );
        await ctx.db.patch(tx._id, { fund: inferredFund });
        updated++;
      }
    }

    return { updated, total: transactions.length };
  },
});
