// utils/generatePurchasePDF.js
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const generatePurchasePDF = async (purchase) => {
  // Create a temporary div to hold our PDF content
  const element = document.createElement("div");
  element.style.position = "absolute";
  element.style.left = "-9999px";
  element.style.padding = "20px";
  element.style.width = "794px"; // A4 width in pixels at 96dpi
  element.style.fontFamily = "Helvetica, Arial, sans-serif";
  document.body.appendChild(element);

  const formatCurrency = (value) =>
    `Ksh ${Number(value || 0)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderStatus = (status) => {
    if (!status) return "N/A";
    const statusColors = {
      approved: "#10B981",
      pending: "#F59E0B",
      rejected: "#EF4444",
    };
    const color = statusColors[status.toLowerCase()] || "#6B7280";
    return `<span style="color: ${color}; font-weight: 600; text-transform: capitalize;">${status}</span>`;
  };

  // Create the PDF content
  element.innerHTML = `
    <div style="max-width: 100%; color: #111827;">
      
      <!-- Logo Section -->
      <div>
        <img 
          src="/hotpoint_logo.png" 
          alt="Company Logo" 
          style="display: block; margin: 0 auto; max-height: 80px; margin-top: -40px;" 
        />
      </div>

      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #EF4444; padding-bottom: 15px;">
        <div>
          <h1 style="color: #B91C1C; font-size: 24px; font-weight: 700; margin: 0;">Product Purchase Information</h1>
          <p style="color: #6B7280; font-size: 14px; margin: 5px 0 0;">Generated on ${new Date().toLocaleDateString("en-GB")}</p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 16px; font-weight: 600; color: #B91C1C;">Reference: ${purchase.payrollno || "N/A"}</div>
          <div style="font-size: 14px; color: #6B7280;">ID: ${purchase.id || "N/A"}</div>
        </div>
      </div>

      <!-- Summary Section -->
      <div style="background-color: #FEF2F2; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
          <div>
            <h3 style="color: #B91C1C; font-size: 14px; margin: 0 0 5px;">Staff Name</h3>
            <p style="margin: 0; font-size: 16px; font-weight: 500;">${purchase.staffname || "N/A"}</p>
          </div>
          <div>
            <h3 style="color: #B91C1C; font-size: 14px; margin: 0 0 5px;">Item Name</h3>
            <p style="margin: 0; font-size: 16px; font-weight: 500;">${purchase.itemname || "N/A"}</p>
          </div>
          <div>
            <h3 style="color: #B91C1C; font-size: 14px; margin: 0 0 5px;">Total Amount</h3>
            <p style="margin: 0; font-size: 16px; font-weight: 500;">${formatCurrency(purchase.discountedvalue)}</p>
          </div>
        </div>
      </div>

      <!-- Main Content Sections -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;">
        <!-- Left Column -->
        <div>
          <!-- Staff Information -->
          <div style="margin-bottom: 20px;">
            <h2 style="color: #B91C1C; font-size: 18px; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px; margin: 0 0 15px;">Staff Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">Payroll No</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${purchase.payrollno || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">Department</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${purchase.department || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">Employment Status</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${purchase.is_employed || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: #6B7280;">Probation Status</td>
                <td style="padding: 8px 0; font-size: 14px; font-weight: 500; text-align: right;">${purchase.on_probation || "N/A"}</td>
              </tr>
            </table>
          </div>

          <!-- Product Information -->
          <div style="margin-bottom: 20px;">
            <h2 style="color: #B91C1C; font-size: 18px; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px; margin: 0 0 15px;">Product Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">Item Status</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${purchase.itemstatus || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">Product Code</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${purchase.productcode || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: #6B7280;">Payment Terms</td>
                <td style="padding: 8px 0; font-size: 14px; font-weight: 500; text-align: right;">${purchase.employee_payment_terms || "N/A"}</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Right Column -->
        <div>
          <!-- Pricing Details -->
          <div style="margin-bottom: 58px;">
            <h2 style="color: #B91C1C; font-size: 18px; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px; margin: 0 0 15px;">Pricing Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">TD Price</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${formatCurrency(purchase.tdprice)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">Discount Rate</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${Number(purchase.discountrate || 0).toFixed(2)}%</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: #6B7280;">Discounted Value</td>
                <td style="padding: 8px 0; font-size: 14px; font-weight: 500; text-align: right;">${formatCurrency(purchase.discountedvalue)}</td>
              </tr>
            </table>
          </div>

          <!-- Approval Status -->
          <div style="margin-bottom: 20px;">
            <h2 style="color: #B91C1C; font-size: 18px; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px; margin: 0 0 15px;">Approval Status</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">HR Approval</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${renderStatus(purchase.hr_approval)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">CC Approval</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${renderStatus(purchase.cc_approval)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: #6B7280;">BI Approval</td>
                <td style="padding: 8px 0; font-size: 14px; font-weight: 500; text-align: right;">${renderStatus(purchase.bi_approval)}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <!-- HR Approval Details -->
      <div style="margin-bottom: 25px; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #FEF2F2; padding: 10px 15px;">
          <h2 style="color: #B91C1C; font-size: 16px; margin: 0;">Payroll/HR Approval Details</h2>
        </div>
        <div style="padding: 15px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">HR Approver</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${purchase.hr_approver_name || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">Date Approved</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${formatDate(purchase.hr_approval_date)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">Signature</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${purchase.hr_signature || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 14px; color: #6B7280;">Comments</td>
              <td style="padding: 8px 0; font-size: 14px; font-weight: 500; text-align: right;">${purchase.hr_comments || "No comment"}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Credit Control Details -->
      <div style="margin-bottom: 25px; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #FEF2F2; padding: 10px 15px;">
          <h2 style="color: #B91C1C; font-size: 16px; margin: 0;">Credit Control Verification</h2>
        </div>
        <div style="padding: 15px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">Credit Period</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${purchase.credit_period || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">1/3 Rule Assessment</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${purchase.one_third_rule || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">Purchase History Comments</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${purchase.purchase_history_comments || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">Pending Invoices</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${purchase.pending_invoices || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 14px; color: #6B7280;">Checked By</td>
              <td style="padding: 8px 0; font-size: 14px; font-weight: 500; text-align: right;">${purchase.cc_signature || "N/A"}</td>
            </tr>
            <tr style="height: 100px;">
              <td style="padding: 8px 0; font-size: 14px; color: #6B7280; vertical-align: bottom;">Approval Date</td>
              <td style="padding: 8px 0; font-size: 14px; font-weight: 500; text-align: right; vertical-align: bottom;">${formatDate(purchase.cc_approval_date)}</td>
           </tr>
           
          </table>
        </div>
      </div>

      <!-- Invoicing and Payment -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;">
        <!-- Invoicing -->
        <div style="border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #FEF2F2; padding: 10px 15px;">
            <h2 style="color: #B91C1C; font-size: 16px; margin: 0;">Invoicing Details</h2>
          </div>
          <div style="padding: 15px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">Invoice No</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${purchase.invoice_number || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">Date</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${formatDate(purchase.invoice_date)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">Amount</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${formatCurrency(purchase.invoice_amount)}</td>
              </tr>
               <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">Invoiced By</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${purchase.bi_signature || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: #6B7280;">Date Recorded</td>
                <td style="padding: 8px 0; font-size: 14px; font-weight: 500; text-align: right;">${formatDate(purchase.invoice_recorded_date)}</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Payment -->
        <div style="border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #FEF2F2; padding: 10px 15px;">
            <h2 style="color: #B91C1C; font-size: 16px; margin: 0;">Payment Details</h2>
          </div>
          <div style="padding: 15px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">Method</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${purchase.payment_method || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">Reference</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${purchase.payment_reference || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #6B7280;">Date</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; font-weight: 500; text-align: right;">${formatDate(purchase.payment_date)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: #6B7280;">Amount</td>
                <td style="padding: 8px 0; font-size: 14px; font-weight: 500; text-align: right;">${formatCurrency(purchase.amount)}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 2px solid #EF4444; padding-top: 15px; text-align: center; color: #6B7280; font-size: 12px;">
        <p>This document was generated automatically by Hotpoint Staff Product Purchase Portal.</p>
        <p>© ${new Date().getFullYear()} Hotpoint Appliances Ltd. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    // Render HTML to canvas
    const canvas = await html2canvas(element, {
      scale: 3,
      logging: false,
      useCORS: true,
      scrollY: -window.scrollY,
    });

    const imgData = canvas.toDataURL("image/jpeg"); // compressed jpeg

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const filename = `Purchase_${purchase.productcode || purchase._id}_${new Date().toISOString().split("T")[0]}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  } finally {
    // Always remove the temporary DOM element
    document.body.removeChild(element);
  }
};
