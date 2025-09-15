// api/hr/hrviewpurchases/[id]/route.js
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";
import { sendEmail } from "@/lib/emailSender";

// Email template for staff when request is declined
const generateStaffDeclinedEmailHTML = (purchaseDetails) => {
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
                      <p style="background: #ffebee; color: #d32f2f; text-align: center; padding: 10px; font-weight: bold; border-radius: 4px;">Status: Declined</p>
                      <p style="color: #555555; font-size: 15px;">We regret to inform you that your purchase request has been <strong>declined</strong> by HR.</p>
                      
                      ${
                        purchaseDetails.hr_comments
                          ? `
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: #fff8f8; border-left: 4px solid #d32f2f; margin: 20px 0;">
                        <tr>
                          <td style="padding: 16px;">
                            <strong style="color: #d32f2f;">HR Comments:</strong>
                            <p style="margin: 8px 0 0 0; color: #555555;">${purchaseDetails.hr_comments}</p>
                          </td>
                        </tr>
                      </table>
                      `
                          : ""
                      }
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: #f9f9f9; border: 1px solid #eeeeee; border-radius: 4px; margin: 20px 0; padding-bottom:12px;">
                        
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
                          <td width="150" style="padding: 12px 0 0 15px; font-weight: bold; color: #666666;">HR Approver: </td>
                          <td style="padding: 12px 15px 0 0;">${purchaseDetails.hr_approver_name || "n/a"}</td>
                        </tr>
                      </table>
                      
                      <p style="color: #555555; font-size: 15px;">Please contact HR if you have any questions or wish to discuss this decision.</p>
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

// Email template for next approver (Credit Control)
const generateNextApproverEmailHTML = (purchaseDetails) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Purchase Request Requires Credit Control Approval</title>
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
                      <p style="background: #ffebee; color: #B71C1C; text-align: center; padding: 10px; font-weight: bold; border-radius: 4px;">Status: Hr Approved - Pending Credit Control</p>
                      <p style="color: #555555; font-size: 15px;">A new purchase request approved by HR awaits your review and approval.</p>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: #f9f9f9; border: 1px solid #eeeeee; border-radius: 4px; margin: 20px 0; padding-bottom:12px;">
                        
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Staff Name:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.staffname}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Department:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.department}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Item Name:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.itemname}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Product Code:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.productcode || "n/a"}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Original Price:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.tdprice || "n/a"}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">After Discount:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.discountedvalue || "n/a"}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">HR Approver:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.hr_approver_name}</td>
                        </tr>
                        <tr>
                          <td width="150" style="padding: 12px 0 0 15px; font-weight: bold; color: #666666;">HR Approval Date:</td>
                          <td style="padding: 12px 15px 0 0;">${new Date(purchaseDetails.hr_approval_date).toLocaleDateString()}</td>
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

    const previousStatus = currentPurchase[0].hr_approval;
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
         user_credit_period = $11,
         is_employed = $12,
         on_probation = $13,
         hr_comments = $14,
         hr_approval = $15,
         hr_approver_name = $16,
         hr_approval_date = CURRENT_TIMESTAMP,
         hr_approver_id = $17,
         hr_approver_email = $18,
         productpolicy = $19,
         hr_signature = $20
       WHERE id = $21`,
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
        hr_comments || currentPurchase[0].hr_comments || null,
        hr_approval || currentPurchase[0].hr_approval,
        hr_approver_name || user.name,
        user.id,
        user.email,
        productpolicy || currentPurchase[0].productpolicy,
        user.name,
        id,
      ],
    );

    if (rowCount === 0) {
      return Response.json({ message: "Purchase not found" }, { status: 404 });
    }

    // Only send emails if the status actually changed
    if (hr_approval && hr_approval !== previousStatus) {
      const purchaseDetails = {
        ...currentPurchase[0],
        ...{
          staffname: staffname || currentPurchase[0].staffname,
          payrollno: payrollno || currentPurchase[0].payrollno,
          department: department || currentPurchase[0].department,
          itemname: itemname || currentPurchase[0].itemname,
          productcode: productcode || currentPurchase[0].productcode,
          tdprice: tdprice || currentPurchase[0].tdprice,
          discountrate: discountrate || currentPurchase[0].discountrate,
          discountedvalue:
            discountedvalue || currentPurchase[0].discountedvalue,
          hr_comments: hr_comments || currentPurchase[0].hr_comments || null,
          hr_approver_name: hr_approver_name || user.name,
          createdat: currentPurchase[0].createdat,
          hr_approval_date: new Date(),
        },
      };

      if (hr_approval === "approved") {
        // Send to Credit Control department
        const creditControlEmail = process.env.CC_APPROVER; // Replace with actual email

        await sendEmail({
          to: creditControlEmail,
          subject: `Purchase Request Requires Approval (PayrollNo: ${purchaseDetails.payrollno})`,
          html: generateNextApproverEmailHTML(purchaseDetails),
        });
      } else if (hr_approval === "declined") {
        // Send to staff who made the request
        await sendEmail({
          to: staffEmail,
          subject: `Your Purchase Request Has Been Declined (PayrollNo: ${purchaseDetails.payrollno})`,
          html: generateStaffDeclinedEmailHTML(purchaseDetails),
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
