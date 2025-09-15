import pool from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";
import { sendEmail } from "@/lib/emailSender";

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

// Email template for staff when request is declined by Credit Control
const generateCreditControlDeclinedEmailHTML = (purchaseDetails) => {
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
                      <p style="background: #ffebee; color: #d32f2f; text-align: center; padding: 10px; font-weight: bold; border-radius: 4px;">Status: Declined by Credit Control</p>
                      <p style="color: #555555; font-size: 15px;">We regret to inform you that your purchase request has been <strong>declined</strong> by the Credit Control department.</p>
                      
                      ${
                        purchaseDetails.purchase_history_comments
                          ? `
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: #fff8f8; border-left: 4px solid #d32f2f; margin: 20px 0;">
                        <tr>
                          <td style="padding: 16px;">
                            <strong style="color: #d32f2f;">Purchase History Comments:</strong>
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
                          <td width="150" style="padding: 12px 0 0 15px; font-weight: bold; color: #666666;">Credit Control Approver:</td>
                          <td style="padding: 12px 15px 0 0;">${purchaseDetails.cc_approver_name || "n/a"}</td>
                        </tr>
                      </table>
                      
                      <p style="color: #555555; font-size: 15px;">Please contact Credit Control if you have any questions or wish to discuss this decision.</p>
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

// Email template for next approver (BI Department)
const generateBIApproverEmailHTML = (purchaseDetails) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Purchase Request Requires BI Approval</title>
        <!--[if mso]>
          <style>
            .detail-row td { padding: 8px 0; }
            .action-button { mso-padding-alt: 12px 24px; }
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
                <table width="100%" cellpadding="0" cellspacing="0" style="background: #fcfcfc; border-top: 5px solid #B71C1C; border-radius: 8px; max-width: 600px; margin: 0 auto;">
                  <tr>
                    <td style="padding: 25px;">
                      <h1 style="color: #B71C1C; font-size: 24px; text-align: center; margin: 0 0 15px 0;">Purchase Request Requires Approval</h1>
                      <p style="background: #ffebee; color: #B71C1C; text-align: center; padding: 10px; font-weight: bold; border-radius: 4px;">Status: Credit Control Approved - Pending Billing & Invoice</p>
                      <p style="color: #555555; font-size: 15px;">A new purchase request approved by Credit Control awaits your review and approval.</p>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: #f9f9f9; border: 1px solid #eeeeee; border-radius: 4px; margin: 20px 0; padding-bottom:12px;">
                        
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Staff Name:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.staffName}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Department:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.department}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Item Name:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.itemName}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Product Code:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.productCode || "n/a"}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Original Price:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.tdPrice || "n/a"}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">After Discount:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.discountedValue || "n/a"}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Credit Control Approver:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.cc_approver_name}</td>
                        </tr>
                        <tr>
                          <td width="150" style="padding: 12px 0 0 15px; font-weight: bold; color: #666666;">Approval Date:</td>
                          <td style="padding: 12px 15px 0 0;">${new Date(purchaseDetails.cc_approval_date).toLocaleDateString()}</td>
                        </tr>
                      </table>
                      
                      <p style="color: #555555; font-size: 15px;">Please review this request in the Staff Purchase Portal at your earliest convenience.</p>
                      
                      <div style="text-align: center; margin-top: 20px;">
                        <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="display:inline-block; background-color: #B71C1C; color: white !important; padding: 12px 24px; text-decoration: none !important; border-radius: 15px; font-weight: bold;">Review Request</a>
                      </div>
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

    const previousStatus = currentPurchase[0].CC_Approval;
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
       cc_signature = ?,
       cc_approval_date = CURRENT_TIMESTAMP,
       cc_approver_id = ?,
       cc_approver_email = ?
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
        cc_approver_name || user.name,
        user.name,
        user.id,
        user.email,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return Response.json({ message: "Purchase not found" }, { status: 404 });
    }

    // Only send emails if the status actually changed
    if (CC_Approval && CC_Approval !== previousStatus) {
      const purchaseDetails = {
        ...currentPurchase[0],
        ...{
          staffName: staffName || currentPurchase[0].staffName,
          payrollNo: payrollNo || currentPurchase[0].payrollNo,
          department: department || currentPurchase[0].department,
          itemName: itemName || currentPurchase[0].itemName,
          productCode: productCode || currentPurchase[0].productCode,
          tdPrice: tdPrice || currentPurchase[0].tdPrice,
          discountRate: discountRate || currentPurchase[0].discountRate,
          discountedValue:
            discountedValue || currentPurchase[0].discountedValue,
          purchase_history_comments:
            purchase_history_comments ||
            currentPurchase[0].purchase_history_comments,
          cc_approver_name: cc_approver_name || user.name,
          createdAt: currentPurchase[0].createdAt,
          cc_approval_date: new Date(),
        },
      };

      if (CC_Approval === "approved") {
        // Send to Credit Control department
        const biApprovalEmail = process.env.BI_APPROVER;

        await sendEmail({
          to: biApprovalEmail,
          subject: `Purchase Request Requires Approval (PayrollNo: ${purchaseDetails.payrollNo})`,
          html: generateBIApproverEmailHTML(purchaseDetails),
        });
      } else if (CC_Approval === "declined") {
        // Send to staff who made the request
        await sendEmail({
          to: staffEmail,
          subject: `Your Purchase Request Has Been Declined (PayrollNo: ${purchaseDetails.payrollNo})`,
          html: generateCreditControlDeclinedEmailHTML(purchaseDetails),
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
