"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// ============================================================================
// Types
// ============================================================================

export interface FundSummary {
  openingBalance: number; // in cents
  totalIncome: number;
  totalExpenditure: number;
  closingBalance: number;
  incomeBreakdown: { category: string; amount: number }[];
  expenseBreakdown: { category: string; amount: number }[];
}

export interface FinancialStatementData {
  schemeName: string;
  strataNumber: string;
  address?: string;
  financialYear: string;
  periodStart: string;
  periodEnd: string;
  adminFund: FundSummary;
  capitalWorksFund: FundSummary;
  generatedDate: string;
  transactionCount?: number;
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#0891b2", // cyan-600
    paddingBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a", // slate-900
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#64748b", // slate-500
    marginBottom: 2,
  },
  schemeInfo: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  schemeInfoColumn: {
    flex: 1,
  },
  schemeInfoLabel: {
    fontSize: 8,
    color: "#94a3b8", // slate-400
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  schemeInfoValue: {
    fontSize: 10,
    color: "#0f172a",
    fontWeight: "bold",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 10,
    backgroundColor: "#f1f5f9", // slate-100
    padding: 8,
    borderRadius: 4,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0", // slate-200
    padding: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#475569", // slate-600
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    padding: 8,
  },
  tableRowAlt: {
    backgroundColor: "#f8fafc", // slate-50
  },
  tableCell: {
    fontSize: 10,
    color: "#334155", // slate-700
  },
  tableCellRight: {
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    backgroundColor: "#0891b2", // cyan-600
    padding: 10,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#ffffff",
  },
  totalAmount: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "right",
  },
  summaryCard: {
    backgroundColor: "#f1f5f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  summaryRowLast: {
    borderBottomWidth: 0,
    backgroundColor: "#0891b2",
    marginHorizontal: -15,
    marginBottom: -15,
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  summaryLabel: {
    fontSize: 10,
    color: "#475569",
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
  },
  summaryLabelWhite: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#ffffff",
  },
  summaryValueWhite: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#ffffff",
  },
  col60: {
    width: "60%",
  },
  col40: {
    width: "40%",
  },
  col50: {
    width: "50%",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: "#94a3b8",
  },
  pageNumber: {
    fontSize: 8,
    color: "#94a3b8",
  },
  fundHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  fundBadge: {
    backgroundColor: "#0891b2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  fundBadgeText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fundTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    marginLeft: 10,
  },
});

// ============================================================================
// Helpers
// ============================================================================

function formatCurrency(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(dollars);
}

// ============================================================================
// Components
// ============================================================================

interface FundSummaryCardProps {
  fundName: string;
  fund: FundSummary;
}

function FundSummaryCard({ fundName, fund }: FundSummaryCardProps) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.fundHeader}>
        <View style={styles.fundBadge}>
          <Text style={styles.fundBadgeText}>{fundName}</Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Opening Balance</Text>
        <Text style={styles.summaryValue}>
          {formatCurrency(fund.openingBalance)}
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Total Income</Text>
        <Text style={[styles.summaryValue, { color: "#059669" }]}>
          + {formatCurrency(fund.totalIncome)}
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Total Expenditure</Text>
        <Text style={[styles.summaryValue, { color: "#dc2626" }]}>
          - {formatCurrency(fund.totalExpenditure)}
        </Text>
      </View>

      <View style={[styles.summaryRow, styles.summaryRowLast]}>
        <Text style={styles.summaryLabelWhite}>Closing Balance</Text>
        <Text style={styles.summaryValueWhite}>
          {formatCurrency(fund.closingBalance)}
        </Text>
      </View>
    </View>
  );
}

interface BreakdownTableProps {
  title: string;
  items: { category: string; amount: number }[];
  total: number;
  color?: string;
}

function BreakdownTable({ title, items, total }: BreakdownTableProps) {
  if (items.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={{ color: "#94a3b8", fontStyle: "italic", padding: 10 }}>
          No transactions in this period.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.col60]}>Category</Text>
          <Text
            style={[styles.tableHeaderCell, styles.col40, styles.tableCellRight]}
          >
            Amount
          </Text>
        </View>

        {items.map((item, index) => (
          <View
            key={item.category}
            style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}
          >
            <Text style={[styles.tableCell, styles.col60]}>{item.category}</Text>
            <Text
              style={[styles.tableCell, styles.col40, styles.tableCellRight]}
            >
              {formatCurrency(item.amount)}
            </Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, styles.col60]}>Total</Text>
          <Text style={[styles.totalAmount, styles.col40]}>
            {formatCurrency(total)}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ============================================================================
// Main Document
// ============================================================================

export function FinancialStatementPDF({ data }: { data: FinancialStatementData }) {
  const totalOpeningBalance =
    data.adminFund.openingBalance + data.capitalWorksFund.openingBalance;
  const totalClosingBalance =
    data.adminFund.closingBalance + data.capitalWorksFund.closingBalance;

  return (
    <Document>
      {/* Page 1: Executive Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Statement of Key Financial Information</Text>
          <Text style={styles.subtitle}>
            For the Financial Year {data.financialYear}
          </Text>

          <View style={styles.schemeInfo}>
            <View style={styles.schemeInfoColumn}>
              <Text style={styles.schemeInfoLabel}>Strata Scheme</Text>
              <Text style={styles.schemeInfoValue}>{data.schemeName}</Text>
              <Text style={{ fontSize: 9, color: "#64748b" }}>
                {data.strataNumber}
              </Text>
            </View>
            <View style={styles.schemeInfoColumn}>
              <Text style={styles.schemeInfoLabel}>Address</Text>
              <Text style={styles.schemeInfoValue}>
                {data.address || "Not specified"}
              </Text>
            </View>
            <View style={styles.schemeInfoColumn}>
              <Text style={styles.schemeInfoLabel}>Reporting Period</Text>
              <Text style={styles.schemeInfoValue}>
                {data.periodStart} to {data.periodEnd}
              </Text>
            </View>
          </View>
        </View>

        {/* Combined Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Combined Fund Summary</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.col50]}>Fund</Text>
              <Text
                style={[
                  styles.tableHeaderCell,
                  { width: "25%" },
                  styles.tableCellRight,
                ]}
              >
                Opening
              </Text>
              <Text
                style={[
                  styles.tableHeaderCell,
                  { width: "25%" },
                  styles.tableCellRight,
                ]}
              >
                Closing
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col50]}>
                Administrative Fund
              </Text>
              <Text
                style={[styles.tableCell, { width: "25%" }, styles.tableCellRight]}
              >
                {formatCurrency(data.adminFund.openingBalance)}
              </Text>
              <Text
                style={[styles.tableCell, { width: "25%" }, styles.tableCellRight]}
              >
                {formatCurrency(data.adminFund.closingBalance)}
              </Text>
            </View>

            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <Text style={[styles.tableCell, styles.col50]}>
                Capital Works Fund
              </Text>
              <Text
                style={[styles.tableCell, { width: "25%" }, styles.tableCellRight]}
              >
                {formatCurrency(data.capitalWorksFund.openingBalance)}
              </Text>
              <Text
                style={[styles.tableCell, { width: "25%" }, styles.tableCellRight]}
              >
                {formatCurrency(data.capitalWorksFund.closingBalance)}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, styles.col50]}>Total</Text>
              <Text style={[styles.totalAmount, { width: "25%" }]}>
                {formatCurrency(totalOpeningBalance)}
              </Text>
              <Text style={[styles.totalAmount, { width: "25%" }]}>
                {formatCurrency(totalClosingBalance)}
              </Text>
            </View>
          </View>
        </View>

        {/* Fund Cards */}
        <View style={{ flexDirection: "row", marginTop: 20, gap: 15 }}>
          <View style={{ flex: 1 }}>
            <FundSummaryCard fundName="Admin Fund" fund={data.adminFund} />
          </View>
          <View style={{ flex: 1 }}>
            <FundSummaryCard
              fundName="Capital Works"
              fund={data.capitalWorksFund}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated: {data.generatedDate} | Autonomous Strata Manager
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>

      {/* Page 2: Administrative Fund Detail */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Administrative Fund - Detailed Breakdown</Text>
          <Text style={styles.subtitle}>{data.financialYear}</Text>
        </View>

        <FundSummaryCard fundName="Admin Fund" fund={data.adminFund} />

        <BreakdownTable
          title="Income"
          items={data.adminFund.incomeBreakdown}
          total={data.adminFund.totalIncome}
        />

        <BreakdownTable
          title="Expenditure"
          items={data.adminFund.expenseBreakdown}
          total={data.adminFund.totalExpenditure}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {data.schemeName} ({data.strataNumber})
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>

      {/* Page 3: Capital Works Fund Detail */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Capital Works Fund - Detailed Breakdown</Text>
          <Text style={styles.subtitle}>{data.financialYear}</Text>
        </View>

        <FundSummaryCard fundName="Capital Works" fund={data.capitalWorksFund} />

        <BreakdownTable
          title="Income"
          items={data.capitalWorksFund.incomeBreakdown}
          total={data.capitalWorksFund.totalIncome}
        />

        <BreakdownTable
          title="Expenditure"
          items={data.capitalWorksFund.expenseBreakdown}
          total={data.capitalWorksFund.totalExpenditure}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {data.schemeName} ({data.strataNumber})
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
