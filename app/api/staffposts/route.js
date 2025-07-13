import { pool } from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";
import { sendEmail } from "@/lib/emailSender";

const generatePurchaseEmailHTML = (purchaseDetails) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Purchase Request</title>
        <!--[if mso]>
          <style>
            .detail-row td { padding: 8px 0; }
          </style>
        <![endif]-->
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color:#ffffff;">
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
                      <h1 style="color: #B71C1C; font-size: 24px; text-align: center; margin: 0 0 15px 0;">New Purchase Request</h1>
                      <p style="color: #555555; font-size: 15px;">A new purchase request has been submitted and requires your approval.</p>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: #f9f9f9; border: 1px solid #eeeeee; border-radius: 4px; margin: 20px 0; padding-bottom:12px;">
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Request ID:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.requestid}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Staff Name:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.staffname}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Payroll No:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.payrollno}</td>
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
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Price:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.tdprice || "n/a"}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Discount:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.discountrate || "n/a"}%</td>
                        </tr>
                        <tr>
                          <td width="150" style="padding: 12px 0 0 15px; font-weight: bold; color: #666666;">Final Price:</td>
                          <td style="padding: 12px 15px 0 0;">${purchaseDetails.discountedvalue || "n/a"}</td>
                        </tr>
                      </table>
                      
                      <p style="color: #555555; font-size: 15px;">Please log in to the Staff Purchase Portal to review and approve this request.</p>
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

const parseNumber = (value) => {
  return value === "" || value == null ? null : parseFloat(value);
};

export async function POST(request) {
  let client;
  try {
    // 1. Get the logged-in user
    const user = await getCurrentUser();
    if (!user) {
      return Response.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    client = await pool.connect();
    const body = await request.json();

    // Execute the query using PostgreSQL syntax
    const { rows } = await client.query(
      `INSERT INTO purchasesinfo 
       (staffname, user_id, user_email, payrollno, department, itemname, itemstatus, productcode, 
        tdprice, discountrate, discountedvalue, employee_payment_terms, signature, hr_approval, cc_approval, bi_approval) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'pending', 'pending', 'pending')
       RETURNING id`, // PostgreSQL returns the inserted ID using RETURNING
      [
        body.staffname,
        user.id,
        user.email,
        body.payrollno,
        body.department,
        body.itemname,
        body.itemstatus,
        body.productcode,
        parseNumber(body.tdprice),
        parseNumber(body.discountrate),
        parseNumber(body.discountedvalue),
        body.employee_payment_terms,
        user.name,
      ],
    );

    // Send email notification to relevant parties (e.g., HR, approvers)
    const purchaseDetails = {
      staffname: body.staffname,
      payrollno: body.payrollno,
      department: body.department,
      itemname: body.itemname,
      productcode: body.productcode,
      requestid: rows[0].id,
      tdprice: parseNumber(body.tdprice),
      discountrate: parseNumber(body.discountrate),
      discountedvalue: parseNumber(body.discountedvalue),
    };

    const emailHtml = generatePurchaseEmailHTML(purchaseDetails);
    const hrEmail = "gt009@hotpoint.co.ke";

    await sendEmail({
      to: hrEmail,
      subject: `New Purchase Request from ${body.staffname} ID: (${purchaseDetails.requestid})`,
      html: emailHtml,
    });

    return Response.json(
      {
        success: true,
        message: "Purchase recorded successfully and approvers notified",
        id: rows[0]?.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Database or email error:", error);
    return Response.json(
      {
        success: false,
        message: "Error recording purchase or sending notifications",
        error: error.message,
      },
      { status: 500 },
    );
  } finally {
    if (client) client.release();
  }
}
