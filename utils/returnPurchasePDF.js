import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  pdf,
} from "@react-pdf/renderer";
import { formatCreditPeriod } from "@/public/assets";

// Register a standard font (actually Lato)
Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: `https://fonts.gstatic.com/s/lato/v17/S6uyw4BMUTPHjx4wWw.ttf`,
      fontWeight: 400,
    },
    {
      src: `https://fonts.gstatic.com/s/lato/v17/S6u9w4BMUTPHh6Uew-w.ttf`,
      fontWeight: 700,
    },
  ],
});

// --- STYLES ---
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingVertical: 20,
    paddingHorizontal: 35,
    color: "#1F2937",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    alignItems: "flex-start",
  },
  headerLeft: { color: "#4B5563" },
  headerRight: { textAlign: "right" },
  title: { fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 2 },
  subtitle: { fontSize: 10, color: "#6B7280" },
  section: { marginBottom: 12 },
  rowSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 10,
  },
  sectionHalf: {
    width: "48%", // each half occupies roughly half of the page width
  },
  sectionRow: { flexDirection: "row", marginBottom: 3, alignItems: "center" },
  sectionLabel: { width: "30%", color: "#6B7280", textAlign: "left" },
  sectionValue: { width: "60%", fontWeight: 400, textAlign: "left" },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    borderBottom: "1px solid #D1D5DB",
    paddingBottom: 4,
    marginBottom: 8,
    color: "#374151",
  },
  infoRow: { flexDirection: "row", marginBottom: 3, alignItems: "center" },
  infoLabel: { width: "20%", color: "#6B7280", textAlign: "left" },
  infoValue: { width: "80%", fontWeight: 400, textAlign: "left" },
  table: {
    width: "100%",
    border: "1px solid #E5E7EB",
    borderRadius: 3,
    fontSize: 9,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderBottom: "1px solid #E5E7EB",
    padding: 6,
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #E5E7EB",
    padding: 6,
  },
  tableCol1: { width: "35%" },
  tableCol2: { width: "20%" },
  tableCol3: { width: "15%", textAlign: "right" },
  tableCol4: { width: "15%", textAlign: "right" },
  tableCol5: { width: "15%", textAlign: "right" },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  summaryBox: { width: "45%" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  summaryLabel: { color: "#6B7280" },
  summaryValue: { fontWeight: 700 },
  summaryTotal: { borderTop: "1px solid #D1D5DB", paddingTop: 4, marginTop: 4 },
  subSection: { marginBottom: 8 },
  subSectionTitle: {
    fontWeight: 700,
    color: "#374151",
    marginBottom: 5,
    borderBottom: "1px solid #E5E7EB",
    paddingBottom: 2,
  },

  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 8,
    color: "#9CA3AF",
  },
});

// --- HELPERS ---
const formatCurrency = (value) =>
  `Ksh ${Number(value || 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

const biApprovalDate = new Date();

const formatDate = (dateString) =>
  dateString ? new Date(dateString).toLocaleDateString("en-GB") : "N/A";

const formatStatus = (status) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending";

const calculateDaysDifference = (startDate, endDate) => {
  if (!startDate || !endDate) return "N/A";
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return `${diff} day${diff !== 1 ? "s" : ""}`;
};

// --- PDF DOCUMENT ---
const PurchasePDFDocument = ({ purchaseData, products, createdAt, id }) => {
  const totalDiscount = products.reduce(
    (sum, p) => sum + (Number(p.tdPrice) - Number(p.discountedValue)),
    0,
  );
  const grandTotal = products.reduce(
    (sum, p) => sum + Number(p.discountedValue),
    0,
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>Staff Purchase Summary</Text>
              <Text style={styles.subtitle}>Hotpoint Appliances Ltd.</Text>
            </View>
            <View style={styles.headerRight}>
              <Text>Reference No: {purchaseData.payrollNo || "N/A"}</Text>
              <Text>Request ID: {id || "N/A"}</Text>
              <Text>
                Date Issued:{" "}
                {formatDate(purchaseData.bi_approval_date || biApprovalDate)}
              </Text>
            </View>
          </View>

          {/* Staff Info & Payment Details */}
          <View style={styles.rowSection}>
            {/* Staff Info- To the left */}
            <View style={styles.sectionHalf}>
              <Text style={styles.sectionTitle}>Staff Details</Text>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionLabel}>Staff Name</Text>
                <Text style={styles.sectionValue}>
                  {purchaseData.staffName || "N/A"}
                </Text>
              </View>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionLabel}>Payroll Number</Text>
                <Text style={styles.sectionValue}>
                  {purchaseData.payrollNo || "N/A"}
                </Text>
              </View>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionLabel}>Department</Text>
                <Text style={styles.sectionValue}>
                  {purchaseData.department || "N/A"}
                </Text>
              </View>
            </View>

            {/* Payment Details - To the right */}
            <View style={styles.sectionHalf}>
              <Text style={styles.sectionTitle}>Payment Details</Text>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionLabel}>Payment Terms</Text>
                <Text style={styles.sectionValue}>
                  {purchaseData.employee_payment_terms || "N/A"}
                </Text>
              </View>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionLabel}>Credit Period</Text>
                <Text style={styles.sectionValue}>
                  {formatCreditPeriod(purchaseData.user_credit_period)}
                </Text>
              </View>
            </View>
          </View>

          {/* Products Table */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Purchased Items</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCol1}>Item Description</Text>
                <Text style={styles.tableCol2}>Product Code</Text>
                <Text style={styles.tableCol3}>Price</Text>
                <Text style={styles.tableCol4}>Discount</Text>
                <Text style={styles.tableCol5}>Total</Text>
              </View>
              {products.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.tableRow,
                    index % 2 !== 0 && { backgroundColor: "#F9FAFB" },
                  ]}
                >
                  <Text style={styles.tableCol1}>{item.itemName}</Text>
                  <Text style={styles.tableCol2}>{item.productCode}</Text>
                  <Text style={styles.tableCol3}>
                    {formatCurrency(item.tdPrice)}
                  </Text>
                  <Text style={styles.tableCol4}>
                    {formatCurrency(
                      Number(item.tdPrice) - Number(item.discountedValue),
                    )}
                  </Text>
                  <Text style={styles.tableCol5}>
                    {formatCurrency(item.discountedValue)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Totals */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Discount</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(totalDiscount)}
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text
                  style={[
                    styles.summaryLabel,
                    { fontWeight: 700, color: "#1F2937" },
                  ]}
                >
                  Total Discounted Value
                </Text>
                <Text style={[styles.summaryValue, { fontSize: 12 }]}>
                  {formatCurrency(grandTotal)}
                </Text>
              </View>
            </View>
          </View>

          {/* --- NEW: VERTICAL VERIFICATION & APPROVAL --- */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Verification & Approval Details
            </Text>
            {/* Human Resources */}
            <View style={styles.subSection}>
              <Text style={styles.subSectionTitle}>Human Resources</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Employment Status</Text>
                <Text style={styles.infoValue}>
                  {purchaseData.is_employed || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>On Probation</Text>
                <Text style={styles.infoValue}>
                  {purchaseData.on_probation || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>HR Comments</Text>
                <Text style={styles.infoValue}>
                  {purchaseData.hr_comments || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Approval Status</Text>
                <Text style={styles.infoValue}>
                  {formatStatus(purchaseData.HR_Approval)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Approved By</Text>
                <Text style={styles.infoValue}>
                  {purchaseData.hr_approver_name || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>
                  {formatDate(purchaseData.hr_approval_date)}
                </Text>
              </View>
            </View>

            {/* Credit Control */}
            <View style={styles.subSection}>
              <Text style={styles.subSectionTitle}>Credit Control</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Credit Period</Text>
                <Text style={styles.infoValue}>
                  {purchaseData.credit_period || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>1/3 Rule Check</Text>
                <Text style={styles.infoValue}>
                  {purchaseData.one_third_rule || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Pending Invoices</Text>
                <Text style={styles.infoValue}>
                  {purchaseData.pending_invoices || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>History Comments</Text>
                <Text style={styles.infoValue}>
                  {purchaseData.purchase_history_comments || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Approval Status</Text>
                <Text style={styles.infoValue}>
                  {formatStatus(purchaseData.CC_Approval)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Approved By</Text>
                <Text style={styles.infoValue}>
                  {purchaseData.cc_approver_name || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>
                  {formatDate(purchaseData.cc_approval_date)}
                </Text>
              </View>
            </View>

            {/* Billing & Invoicing */}
            <View style={styles.subSection}>
              <Text style={styles.subSectionTitle}>Billing & Invoicing</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Invoice Number</Text>
                <Text style={styles.infoValue}>
                  {purchaseData.invoice_number || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Invoice Date</Text>
                <Text style={styles.infoValue}>
                  {formatDate(purchaseData.invoice_date)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Invoice Amount</Text>
                <Text style={styles.infoValue}>
                  {formatCurrency(purchaseData.invoice_amount)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Payment Method</Text>
                <Text style={styles.infoValue}>
                  {purchaseData.payment_method || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Payment Reference</Text>
                <Text style={styles.infoValue}>
                  {purchaseData.payment_reference || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Payment Date</Text>
                <Text style={styles.infoValue}>
                  {formatDate(purchaseData.payment_date)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Approval Status</Text>
                <Text style={styles.infoValue}>
                  {formatStatus(purchaseData.BI_Approval)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Approved By</Text>
                <Text style={styles.infoValue}>
                  {purchaseData.bi_approver_name || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>
                  {formatDate(purchaseData.bi_approval_date || biApprovalDate)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Approval Time</Text>
                <Text style={styles.infoValue}>
                  {calculateDaysDifference(
                    createdAt,
                    purchaseData.bi_approval_date || biApprovalDate,
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          This is an automatically generated document. &copy;{" "}
          {new Date().getFullYear()} Hotpoint Appliances Ltd.
        </Text>
      </Page>
    </Document>
  );
};

// --- PDF GENERATORS ---
export async function generatePurchasePDF({
  purchaseData,
  products,
  createdAt,
  id,
}) {
  const pdfStream = await pdf(
    <PurchasePDFDocument
      purchaseData={purchaseData}
      products={products}
      createdAt={createdAt}
      id={id}
    />,
  ).toBuffer();

  return {
    filename: `Purchase_${purchaseData.staffName || purchaseData.payrollNo}_${
      new Date().toISOString().split("T")[0]
    }.pdf`,
    content: pdfStream,
    contentType: "application/pdf",
  };
}

export async function generateClientPDF({
  purchaseData,
  products,
  createdAt,
  id,
}) {
  const blob = await pdf(
    <PurchasePDFDocument
      purchaseData={purchaseData}
      products={products}
      createdAt={createdAt}
      id={id}
    />,
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Purchase_${purchaseData.staffName || purchaseData.payrollNo}_${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
