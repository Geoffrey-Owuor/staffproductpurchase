import pool from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";
import { sendEmail } from "@/lib/emailSender";
import { generatePurchasePDF } from "@/utils/returnPurchasePDF";

export async function GET(request, { params }) {
  let connection;

  try {
    const { id } = await params;
    connection = await pool.getConnection();

    const [rows] = await connection.execute(
      `SELECT * FROM purchasesInfo WHERE id= ?`,
      [id],
    );

    if (rows.length === 0) {
      return Response.json({ error: "Purchase not found" }, { status: 404 });
    }
    return Response.json(rows[0]);
  } catch (error) {
    console.error("Failed: ", error);
    return Response.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

function calculateDaysDifference(startDate, endDate) {
  if (!startDate || !endDate) return "N/A";

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
}

// Email template for staff when request is declined by BI Department
const generateBIDeclinedEmailHTML = (purchaseDetails) => {
  return `
   <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Purchase Request Declined</title>
        <!--[if mso]>
          <style>
            .detail-row td { padding: 8px 0; }
          </style>
        <![endif]-->
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #ffffff;">
        <center>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <img src="https://hotpoint.co.ke/media/images/Hotpoint_Appliances_Ltd.width-800.png" alt="Hotpoint Appliances" width="180" style="display: block;">
              </td>
            </tr>
            <tr>
              <td>
                <table width="100%" cellpadding="0" cellspacing="0" style="background: #fcfcfc; border-top: 5px solid #d32f2f; border-radius: 8px; max-width: 600px; margin: 0 auto;">
                  <tr>
                    <td style="padding: 25px;">
                      <h1 style="color: #d32f2f; font-size: 24px; text-align: center; margin: 0 0 15px 0;">Purchase Request Declined</h1>
                      <p style="background: #ffebee; color: #d32f2f; text-align: center; padding: 10px; font-weight: bold; border-radius: 4px;">Status: Declined by Billing & Invoice Department</p>
                      <p style="color: #555555; font-size: 15px;">We regret to inform you that your purchase request has been <strong>declined</strong> by the Billing & Invoice department.</p>
                      
                      ${
                        purchaseDetails.purchase_history_comments
                          ? `
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: #fff8f8; border-left: 4px solid #d32f2f; margin: 20px 0;">
                        <tr>
                          <td style="padding: 16px;">
                            <strong style="color: #d32f2f;">Decline Reason:</strong>
                            <p style="margin: 8px 0 0 0; color: #555555;">${purchaseDetails.purchase_history_comments}</p>
                          </td>
                        </tr>
                      </table>
                      `
                          : ""
                      }
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: #f9f9f9; border: 1px solid #eeeeee; border-radius: 4px; margin: 20px 0; padding-bottom:12px;">
                       
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Item Name:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.itemName}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Request Date:</td>
                          <td style="padding: 12px 15px 12px 0;">${new Date(purchaseDetails.createdAt).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                          <td width="150" style="padding: 12px 0 0 15px; font-weight: bold; color: #666666;">Requested Amount:</td>
                          <td style="padding: 12px 15px 0 0;">${purchaseDetails.discountedValue || "n/a"}</td>
                        </tr>
                        <tr>
                          <td width="150" style="padding: 12px 0 0 15px; font-weight: bold; color: #666666;">Billing Invoice Approver:</td>
                          <td style="padding: 12px 15px 0 0;">${purchaseDetails.bi_approver_name || "n/a"}</td>
                        </tr>
                      </table>
                      
                      <p style="color: #555555; font-size: 15px;">Please contact Billing & Invoice department if you have any questions or wish to discuss this decision.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px 0; color: #888888; font-size: 13px;">
                <p>© ${new Date().getFullYear()} Hotpoint Appliances Ltd. All rights reserved.</p>
                <p>402, 00606 - Sukari Industrial Estate, Ruiru, Kenya</p>
              </td>
            </tr>
          </table>
        </center>
      </body>
    </html>
  `;
};

// Email template for staff when request is approved by BI Department
const generateBIApprovedEmailHTML = (purchaseDetails) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Purchase Request Approved</title>
        <!--[if mso]>
          <style>
            .detail-row td { padding: 8px 0; }
          </style>
        <![endif]-->
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #ffffff;">
        <center>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <img src="https://hotpoint.co.ke/media/images/Hotpoint_Appliances_Ltd.width-800.png" alt="Hotpoint Appliances" width="180" style="display: block;">
              </td>
            </tr>
            <tr>
              <td>
                <table width="100%" cellpadding="0" cellspacing="0" style="background: #fcfcfc; border-top: 5px solid #4CAF50; border-radius: 8px; max-width: 600px; margin: 0 auto;">
                  <tr>
                    <td style="padding: 25px;">
                      <h1 style="color: #4CAF50; font-size: 24px; text-align: center; margin: 0 0 15px 0;">Purchase Request Approved</h1>
                      <p style="background: #E8F5E9; color: #4CAF50; text-align: center; padding: 10px; font-weight: bold; border-radius: 4px;">Status: Approved by Billing & Invoice Department</p>
                      <p style="color: #555555; font-size: 15px;">We are pleased to inform you that your purchase request has been <strong>fully approved</strong> and is now being processed.</p>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: #f9f9f9; border: 1px solid #eeeeee; border-radius: 4px; margin: 20px 0; padding-bottom:12px;">
                        
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Item Name:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.itemName}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Approved Amount:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.discountedValue || "n/a"}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Invoice Number:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.invoice_number || "n/a"}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Payment Method:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.payment_method || "n/a"}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Final Approval Date:</td>
                          <td style="padding: 12px 15px 12px 0;">${new Date(purchaseDetails.bi_approval_date || new Date()).toLocaleDateString()}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Billing Invoice Approver:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.bi_approver_name || "n/a"}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Approval Time:</td>
                          <td style="padding: 12px 15px 12px 0;">
                            ${calculateDaysDifference(purchaseDetails.createdAt, purchaseDetails.bi_approval_date)}
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #555555; font-size: 15px;">Your purchase is now complete. You will be contacted regarding collection/delivery arrangements.</p>
                      
                      <p style="color: #555555; font-size: 15px;">Thank you for using our staff purchase program.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px 0; color: #888888; font-size: 13px;">
                <p>© ${new Date().getFullYear()} Hotpoint Appliances Ltd. All rights reserved.</p>
                <p>402, 00606 - Sukari Industrial Estate, Ruiru, Kenya</p>
              </td>
            </tr>
          </table>
        </center>
      </body>
    </html>
  `;
};

export async function PUT(request, { params }) {
  let connection;
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json("No User Found", { status: 200 });
    }
    const { id } = await params;
    const {
      staffName,
      payrollNo,
      department,
      itemName,
      itemStatus,
      productPolicy,
      productCode,
      tdPrice,
      discountRate,
      discountedValue,
      employee_payment_terms,
      user_credit_period,
      is_employed,
      on_probation,
      hr_comments,
      HR_Approval,
      hr_approver_name,
      credit_period,
      one_third_rule,
      purchase_history_comments,
      pending_invoices,
      CC_Approval,
      cc_approver_name,
      invoice_date,
      invoice_number,
      invoice_amount,
      invoice_recorded_date,
      payment_method,
      payment_reference,
      payment_date,
      amount,
      bi_approver_name,
      BI_Approval,
    } = await request.json();
    connection = await pool.getConnection();

    // Get current purchase details
    const [currentPurchase] = await connection.execute(
      `SELECT * FROM purchasesInfo WHERE id = ?`,
      [id],
    );

    if (currentPurchase.length === 0) {
      return Response.json({ message: "Purchase not found" }, { status: 404 });
    }

    const previousStatus = currentPurchase[0].BI_Approval;
    const staffEmail = currentPurchase[0].user_email;

    const [result] = await connection.execute(
      `UPDATE purchasesInfo 
       SET 
       staffName = ?,
       payrollNo = ?,
       department = ?,
       itemName = ?, 
       itemStatus = ?,
       productPolicy = ?,
       productCode = ?,
       tdPrice = ?,
       discountRate= ?,
       discountedValue = ?,
       employee_payment_terms = ?,
       user_credit_period = ?,
       is_employed = ?,
       on_probation = ?,
       hr_comments = ?,
       HR_Approval = ?,
       hr_approver_name = ?,
       credit_period = ?,
       one_third_rule = ?,
       purchase_history_comments = ?,
       pending_invoices = ?,
       CC_Approval = ?,
       cc_approver_name = ?,
       invoice_date = ?,
       invoice_number = ? ,
       invoice_amount = ? ,
       invoice_recorded_date = ?,
       payment_method = ?,
       payment_reference = ?,
       payment_date = ?,
       amount = ?,
       bi_approver_name = ?,
       bi_signature = ?,
       BI_Approval = ?,
       bi_approver_id = ?,
       bi_approval_date = CURRENT_TIMESTAMP,
       bi_approver_email = ?
       WHERE id = ? 
       `,
      [
        staffName || currentPurchase[0].staffName,
        payrollNo || currentPurchase[0].payrollNo,
        department || currentPurchase[0].department,
        itemName || currentPurchase[0].itemName,
        itemStatus || currentPurchase[0].itemStatus,
        productPolicy || currentPurchase[0].productPolicy,
        productCode || currentPurchase[0].productCode,
        tdPrice || currentPurchase[0].tdPrice,
        discountRate || currentPurchase[0].discountRate,
        discountedValue || currentPurchase[0].discountedValue,
        employee_payment_terms || currentPurchase[0].employee_payment_terms,
        user_credit_period || currentPurchase[0].user_credit_period,
        is_employed || currentPurchase[0].is_employed,
        on_probation || currentPurchase[0].on_probation,
        hr_comments || currentPurchase[0].hr_comments,
        HR_Approval || currentPurchase[0].HR_Approval,
        hr_approver_name || currentPurchase[0].hr_approver_name,
        credit_period || currentPurchase[0].credit_period,
        one_third_rule || currentPurchase[0].one_third_rule,
        purchase_history_comments ||
          currentPurchase[0].purchase_history_comments,
        pending_invoices || currentPurchase[0].pending_invoices,
        CC_Approval || currentPurchase[0].CC_Approval,
        cc_approver_name || currentPurchase[0].cc_approver_name,
        invoice_date || currentPurchase[0].invoice_date,
        invoice_number || currentPurchase[0].invoice_number,
        invoice_amount || currentPurchase[0].invoice_amount,
        invoice_recorded_date || currentPurchase[0].invoice_recorded_date,
        payment_method || currentPurchase[0].payment_method || null,
        payment_reference || currentPurchase[0].payment_reference || null,
        payment_date || currentPurchase[0].payment_date || null,
        amount || currentPurchase[0].amount || null,
        bi_approver_name || user.name,
        user.name,
        BI_Approval || currentPurchase[0].BI_Approval || null,
        user.id,
        user.email,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return Response.json({ message: "Purchase not found" }, { status: 404 });
    }

    // Only send emails if the status actually changed
    if (BI_Approval && BI_Approval !== previousStatus) {
      const purchaseDetails = {
        ...currentPurchase[0],
        ...{
          staffName: staffName || currentPurchase[0].staffName,
          payrollNo: payrollNo || currentPurchase[0].payrollNo,
          department: department || currentPurchase[0].department,
          itemName: itemName || currentPurchase[0].itemName,
          itemStatus: itemStatus || currentPurchase[0].itemStatus,
          employee_payment_terms:
            employee_payment_terms || currentPurchase[0].employee_payment_terms,
          productCode: productCode || currentPurchase[0].productCode,
          tdPrice: tdPrice || currentPurchase[0].tdPrice,
          discountRate: discountRate || currentPurchase[0].discountRate,
          discountedValue:
            discountedValue || currentPurchase[0].discountedValue,
          is_employed: is_employed || currentPurchase[0].is_employed,
          on_probation: on_probation || currentPurchase[0].on_probation,
          hr_comments: hr_comments || currentPurchase[0].hr_comments,
          HR_Approval: HR_Approval || currentPurchase[0].HR_Approval,
          hr_approver_name:
            hr_approver_name || currentPurchase[0].hr_approver_name,
          hr_approval_date: currentPurchase[0].hr_approval_date,
          credit_period: credit_period || currentPurchase[0].credit_period,
          one_third_rule: one_third_rule || currentPurchase[0].one_third_rule,
          pending_invoices:
            pending_invoices || currentPurchase[0].pending_invoices,
          CC_Approval: CC_Approval || currentPurchase[0].CC_Approval,
          cc_approver_name:
            cc_approver_name || currentPurchase[0].cc_approver_name,
          cc_approval_date: currentPurchase[0].cc_approval_date,
          invoice_date: invoice_date || currentPurchase[0].invoice_date,
          invoice_amount: invoice_amount || currentPurchase[0].invoice_amount,
          invoice_recorded_date:
            invoice_recorded_date || currentPurchase[0].invoice_recorded_date,
          purchase_history_comments:
            purchase_history_comments ||
            currentPurchase[0].purchase_history_comments,
          bi_approver_name: bi_approver_name || user.name,
          amount: amount || currentPurchase[0].amount,
          payment_reference:
            payment_reference || currentPurchase[0].payment_reference,
          BI_Approval: BI_Approval || currentPurchase[0].BI_Approval,
          payment_date: payment_date || currentPurchase[0].payment_date,
          createdAt: currentPurchase[0].createdAt,
          bi_approval_date: new Date(),
          invoice_number: invoice_number || currentPurchase[0].invoice_number,
          payment_method: payment_method || currentPurchase[0].payment_method,
          id: id, // Ensure request ID is included for ID in PDF
        },
      };

      if (BI_Approval === "approved") {
        // Send approval email to staff
        const pdfAttachment = await generatePurchasePDF(purchaseDetails);
        await sendEmail({
          to: staffEmail,
          subject: `Your Purchase Request Has Been Approved (PayrollNo: ${purchaseDetails.payrollNo})`,
          html: generateBIApprovedEmailHTML(purchaseDetails),
          attachments: [pdfAttachment], //Attaching the generated pdf
        });
      } else if (BI_Approval === "declined") {
        // Send decline email to staff
        await sendEmail({
          to: staffEmail,
          subject: `Your Purchase Request Has Been Declined (PayrollNo: ${purchaseDetails.payrollNo})`,
          html: generateBIDeclinedEmailHTML(purchaseDetails),
        });
      }
    }

    return Response.json(
      { message: "Purchase Updated Successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Database Error:", error);
    return Response.json(
      { message: "Error updating purchase", error: error.message },
      { status: 500 },
    );
  } finally {
    if (connection) connection.release();
  }
}
