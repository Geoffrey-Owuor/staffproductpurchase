// components/PurchasePDF.js
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

// Optional: Load custom font if needed
Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/helvetica/v14/2qR4tv-4r3T1.woff",
      fontWeight: 400,
    },
  ],
});

// Utility functions
const formatCurrency = (value) =>
  `Ksh ${Number(value || 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
};

const calculateDaysDifference = (startDate, endDate) => {
  if (!startDate || !endDate) return "N/A";
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return `${diff} day${diff !== 1 ? "s" : ""}`;
};

const renderStatus = (status) => {
  const colorMap = {
    approved: "#10B981",
    pending: "#F59E0B",
    rejected: "#EF4444",
  };
  const color = colorMap[status?.toLowerCase()] || "#6B7280";
  return (
    <Text style={{ color, fontWeight: "bold", textTransform: "capitalize" }}>
      {status || "N/A"}
    </Text>
  );
};

// Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    padding: 30,
    color: "#111827",
  },
  section: { marginBottom: 15 },
  header: {
    borderBottom: "2px solid #EF4444",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingBottom: 5,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  tableText: { fontSize: 10, color: "#6B7280" },
  tableValue: { fontSize: 10, fontWeight: "bold" },
  card: {
    border: "1px solid #E5E7EB",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  cardHeader: {
    backgroundColor: "#FEF2F2",
    padding: 5,
    fontSize: 12,
    fontWeight: "bold",
    color: "#B91C1C",
    marginBottom: 5,
  },
  title: { fontSize: 12, fontWeight: "bold", marginBottom: 4 },
});

// Component
const PurchasePDFDocument = ({ purchase }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={{ color: "#B91C1C", fontSize: 16, fontWeight: "bold" }}>
            Product Purchase Information
          </Text>
          <Text style={{ fontSize: 10, color: "#6B7280" }}>
            Generated on {new Date().toLocaleDateString("en-GB")}
          </Text>
        </View>
        <View>
          <Text style={{ fontSize: 10, fontWeight: "bold", color: "#B91C1C" }}>
            Reference: {purchase.payrollno || "N/A"}
          </Text>
          <Text style={{ fontSize: 10, color: "#6B7280" }}>
            ID: {purchase.id || "N/A"}
          </Text>
        </View>
      </View>

      {/* Staff Info */}
      <View style={styles.section}>
        <Text style={styles.title}>Staff Summary</Text>
        <View style={styles.tableRow}>
          <Text style={styles.tableText}>Staff Name</Text>
          <Text style={styles.tableValue}>{purchase.staffname || "N/A"}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableText}>Item Name</Text>
          <Text style={styles.tableValue}>{purchase.itemname || "N/A"}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableText}>Total Amount</Text>
          <Text style={styles.tableValue}>
            {formatCurrency(purchase.discountedvalue)}
          </Text>
        </View>
      </View>

      {/* Staff & Product Details */}
      <View style={[styles.section, { flexDirection: "row", gap: 10 }]}>
        {/* Staff Info */}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Staff Information</Text>
          {[
            ["Payroll No", purchase.payrollno],
            ["Department", purchase.department],
            ["Employment Status", purchase.is_employed],
            ["Probation Status", purchase.on_probation],
          ].map(([label, value], i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableText}>{label}</Text>
              <Text style={styles.tableValue}>{value || "N/A"}</Text>
            </View>
          ))}
        </View>

        {/* Product Info */}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Product Information</Text>
          {[
            ["Item Status", purchase.itemstatus],
            ["Product Code", purchase.productcode],
            ["Payment Terms", purchase.employee_payment_terms],
          ].map(([label, value], i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableText}>{label}</Text>
              <Text style={styles.tableValue}>{value || "N/A"}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Pricing & Approvals */}
      <View style={[styles.section, { flexDirection: "row", gap: 10 }]}>
        {/* Pricing */}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Pricing Details</Text>
          <View style={styles.tableRow}>
            <Text style={styles.tableText}>TD Price</Text>
            <Text style={styles.tableValue}>
              {formatCurrency(purchase.tdprice)}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableText}>Discount Rate</Text>
            <Text style={styles.tableValue}>
              {Number(purchase.discountrate || 0).toFixed(2)}%
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableText}>Discounted Value</Text>
            <Text style={styles.tableValue}>
              {formatCurrency(purchase.discountedvalue)}
            </Text>
          </View>
        </View>

        {/* Approval Status */}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Approval Status</Text>
          <View style={styles.tableRow}>
            <Text style={styles.tableText}>HR Approval</Text>
            {renderStatus(purchase.hr_approval)}
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableText}>CC Approval</Text>
            {renderStatus(purchase.cc_approval)}
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableText}>BI Approval</Text>
            {renderStatus(purchase.bi_approval)}
          </View>
        </View>
      </View>

      {/* HR Section */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>HR Approval Details</Text>
        {[
          ["HR Approver", purchase.hr_approver_name],
          ["Date Approved", formatDate(purchase.hr_approval_date)],
          ["Comments", purchase.hr_comments || "No comment"],
        ].map(([label, value], i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.tableText}>{label}</Text>
            <Text style={styles.tableValue}>{value || "N/A"}</Text>
          </View>
        ))}
      </View>

      {/* Credit Control Section */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>Credit Control Verification</Text>
        {[
          ["Credit Period", purchase.credit_period],
          ["1/3 Rule", purchase.one_third_rule],
          ["Purchase History", purchase.purchase_history_comments],
          ["Pending Invoices", purchase.pending_invoices],
          ["Checked By", purchase.cc_approver_name],
          ["Approval Date", formatDate(purchase.cc_approval_date)],
        ].map(([label, value], i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.tableText}>{label}</Text>
            <Text style={styles.tableValue}>{value || "N/A"}</Text>
          </View>
        ))}
      </View>

      {/* Invoicing & Payment */}
      <View style={[styles.section, { flexDirection: "row", gap: 10 }]}>
        {/* Invoice */}
        <View style={{ flex: 1 }}>
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Invoicing Details</Text>
            {[
              ["Invoice No", purchase.invoice_number],
              ["Date", formatDate(purchase.invoice_date)],
              ["Amount", formatCurrency(purchase.invoice_amount)],
              ["Invoiced By", purchase.bi_approver_name],
              ["Date Recorded", formatDate(purchase.invoice_recorded_date)],
            ].map(([label, value], i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableText}>{label}</Text>
                <Text style={styles.tableValue}>{value || "N/A"}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Payment */}
        <View style={{ flex: 1 }}>
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Payment Details</Text>
            {[
              ["Method", purchase.payment_method],
              ["Reference", purchase.payment_reference],
              ["Date", formatDate(purchase.payment_date)],
              ["Amount", formatCurrency(purchase.amount)],
              [
                "Approval Time",
                calculateDaysDifference(
                  purchase.createdat,
                  purchase.bi_approval_date,
                ),
              ],
            ].map(([label, value], i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableText}>{label}</Text>
                <Text style={styles.tableValue}>{value || "N/A"}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Footer */}
      <View
        style={{
          marginTop: 0,
          borderTop: "2px solid #EF4444",
          paddingTop: 5,
        }}
      >
        <Text style={{ fontSize: 9, color: "#6B7280", textAlign: "center" }}>
          This document was generated automatically by Hotpoint Staff Product
          Purchase Portal.
        </Text>
        <Text style={{ fontSize: 9, color: "#6B7280", textAlign: "center" }}>
          © {new Date().getFullYear()} Hotpoint Appliances Ltd. All rights
          reserved.
        </Text>
      </View>
    </Page>
  </Document>
);

export async function generatePurchasePDF(purchase) {
  const pdfStream = await pdf(
    <PurchasePDFDocument purchase={purchase} />,
  ).toBuffer();

  return {
    filename: `Purchase_${purchase.staffname || purchase.payrollno}_${new Date().toISOString().split("T")[0]}.pdf`,
    content: pdfStream,
    contentType: "application/pdf",
  };
}

export async function generateClientPDF(purchase) {
  const blob = await pdf(<PurchasePDFDocument purchase={purchase} />).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Purchase_${purchase.staffname || purchase.payrollno}_${new Date().toISOString().split("T")[0]}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
