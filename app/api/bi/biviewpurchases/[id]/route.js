// api/bi/biviewpurchases/[id]/route.js
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";
import { sendEmail } from "@/lib/emailSender";
import { generatePurchasePDF } from "@/utils/returnPurchasePDF";

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
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Request ID:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.id}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Item Name:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.itemname}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Request Date:</td>
                          <td style="padding: 12px 15px 12px 0;">${new Date(purchaseDetails.createdat).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                          <td width="150" style="padding: 12px 0 0 15px; font-weight: bold; color: #666666;">Requested Amount:</td>
                          <td style="padding: 12px 15px 0 0;">${purchaseDetails.discountedvalue || "n/a"}</td>
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
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Request ID:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.id}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Item Name:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.itemname}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Approved Amount:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.discountedvalue || "n/a"}</td>
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
                            ${calculateDaysDifference(purchaseDetails.createdat, purchaseDetails.bi_approval_date)}
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

export async function GET(request, { params }) {
  let client;
  try {
    const { id } = await params;
    client = await pool.connect();

    const { rows } = await client.query(
      `SELECT * FROM purchasesinfo WHERE id = $1`,
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
    if (client) client.release();
  }
}

export async function PUT(request, { params }) {
  let client;
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json("No User Found", { status: 401 });
    }

    const { id } = await params;
    const {
      staffname,
      payrollno,
      department,
      itemname,
      itemstatus,
      productpolicy,
      productcode,
      tdprice,
      discountrate,
      discountedvalue,
      employee_payment_terms,
      user_credit_period,
      is_employed,
      on_probation,
      hr_comments,
      hr_approval,
      hr_approver_name,
      credit_period,
      one_third_rule,
      purchase_history_comments,
      pending_invoices,
      cc_approval,
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
      bi_approval,
    } = await request.json();

    client = await pool.connect();

    // Get current purchase details first
    const { rows: currentPurchase } = await client.query(
      `SELECT * FROM purchasesinfo WHERE id = $1`,
      [id],
    );

    if (currentPurchase.length === 0) {
      return Response.json({ message: "Purchase not found" }, { status: 404 });
    }

    const previousStatus = currentPurchase[0].bi_approval;
    const staffEmail = currentPurchase[0].user_email;

    // Update the purchase
    const { rowCount } = await client.query(
      `UPDATE purchasesinfo 
       SET 
         staffname = $1,
         payrollno = $2,
         department = $3,
         itemname = $4, 
         itemstatus = $5,
         productcode = $6,
         tdprice = $7,
         discountrate = $8,
         discountedvalue = $9,
         employee_payment_terms = $10,
         user_credit_period  =$11,
         is_employed = $12,
         on_probation = $13,
         hr_comments = $14,
         hr_approval = $15,
         hr_approver_name = $16,
         credit_period = $17,
         one_third_rule = $18,
         purchase_history_comments = $19,
         pending_invoices = $20,
         cc_approval = $21,
         cc_approver_name = $22,
         invoice_date = $23,
         invoice_number = $24,
         invoice_amount = $25,
         invoice_recorded_date = $26,
         payment_method = $27,
         payment_reference = $28,
         payment_date = $29,
         amount = $30,
         bi_signature = $31,
         bi_approver_name = $32,
         bi_approval = $33,
         bi_approver_id = $34,
         bi_approval_date = CURRENT_TIMESTAMP,
         productpolicy = $35,
         bi_approver_email = $36
       WHERE id = $37`,
      [
        staffname || currentPurchase[0].staffname,
        payrollno || currentPurchase[0].payrollno,
        department || currentPurchase[0].department,
        itemname || currentPurchase[0].itemname,
        itemstatus || currentPurchase[0].itemstatus,
        productcode || currentPurchase[0].productcode,
        tdprice || currentPurchase[0].tdprice,
        discountrate || currentPurchase[0].discountrate,
        discountedvalue || currentPurchase[0].discountedvalue,
        employee_payment_terms || currentPurchase[0].employee_payment_terms,
        user_credit_period || currentPurchase[0].user_credit_period,
        is_employed || currentPurchase[0].is_employed,
        on_probation || currentPurchase[0].on_probation,
        hr_comments || currentPurchase[0].hr_comments,
        hr_approval || currentPurchase[0].hr_approval,
        hr_approver_name || currentPurchase[0].hr_approver_name,
        credit_period || currentPurchase[0].credit_period,
        one_third_rule || currentPurchase[0].one_third_rule,
        purchase_history_comments ||
          currentPurchase[0].purchase_history_comments,
        pending_invoices || currentPurchase[0].pending_invoices,
        cc_approval || currentPurchase[0].cc_approval,
        cc_approver_name || currentPurchase[0].cc_approver_name,
        invoice_date || currentPurchase[0].invoice_date,
        invoice_number || currentPurchase[0].invoice_number,
        invoice_amount || currentPurchase[0].invoice_amount,
        invoice_recorded_date || currentPurchase[0].invoice_recorded_date,
        payment_method || currentPurchase[0].payment_method || null,
        payment_reference || currentPurchase[0].payment_reference || null,
        payment_date || currentPurchase[0].payment_date || null,
        amount || currentPurchase[0].amount || null,
        user.name,
        bi_approver_name || user.name,
        bi_approval || currentPurchase[0].bi_approval || null,
        user.id,
        productpolicy || currentPurchase[0].productpolicy,
        user.email,
        id,
      ],
    );

    if (rowCount === 0) {
      return Response.json({ message: "Purchase not found" }, { status: 404 });
    }

    // Only send emails if the status actually changed
    if (bi_approval && bi_approval !== previousStatus) {
      const purchaseDetails = {
        ...currentPurchase[0],
        ...{
          staffname: staffname || currentPurchase[0].staffname,
          payrollno: payrollno || currentPurchase[0].payrollno,
          department: department || currentPurchase[0].department,
          itemname: itemname || currentPurchase[0].itemname,
          itemstatus: itemstatus || currentPurchase[0].itemstatus,
          employee_payment_terms:
            employee_payment_terms || currentPurchase[0].employee_payment_terms,
          productcode: productcode || currentPurchase[0].productcode,
          tdprice: tdprice || currentPurchase[0].tdprice,
          discountrate: discountrate || currentPurchase[0].discountrate,
          discountedvalue:
            discountedvalue || currentPurchase[0].discountedvalue,
          is_employed: is_employed || currentPurchase[0].is_employed,
          on_probation: on_probation || currentPurchase[0].on_probation,
          hr_comments: hr_comments || currentPurchase[0].hr_comments,
          hr_approval: hr_approval || currentPurchase[0].hr_approval,
          hr_approver_name:
            hr_approver_name || currentPurchase[0].hr_approver_name,
          hr_approval_date: currentPurchase[0].hr_approval_date,
          credit_period: credit_period || currentPurchase[0].credit_period,
          one_third_rule: one_third_rule || currentPurchase[0].one_third_rule,
          pending_invoices:
            pending_invoices || currentPurchase[0].pending_invoices,
          cc_approval: cc_approval || currentPurchase[0].cc_approval,
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
          bi_approval: bi_approval || currentPurchase[0].bi_approval,
          payment_date: payment_date || currentPurchase[0].payment_date,
          createdat: currentPurchase[0].createdat,
          bi_approval_date: new Date(),
          invoice_number: invoice_number || currentPurchase[0].invoice_number,
          payment_method: payment_method || currentPurchase[0].payment_method,
          id: id, // Ensure request ID is included
        },
      };

      if (bi_approval === "approved") {
        const pdfAttachment = await generatePurchasePDF(purchaseDetails);
        // Send approval email to staff
        await sendEmail({
          to: staffEmail,
          subject: `Your Purchase Request Has Been Approved (ID: ${purchaseDetails.id})`,
          html: generateBIApprovedEmailHTML(purchaseDetails),
          attachments: [pdfAttachment],
        });
      } else if (bi_approval === "declined") {
        // Send decline email to staff
        await sendEmail({
          to: staffEmail,
          subject: `Your Purchase Request Has Been Declined (ID: ${purchaseDetails.id})`,
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
    if (client) client.release();
  }
}
