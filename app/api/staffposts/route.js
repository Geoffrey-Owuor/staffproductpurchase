import pool from "@/lib/db";
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
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Staff Name:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.staffName}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Payroll No:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.payrollNo}</td>
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
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Price:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.tdPrice || "n/a"}</td>
                        </tr>
                        <tr class="detail-row">
                          <td width="150" style="padding: 12px 0 12px 15px; font-weight: bold; color: #666666;">Discount:</td>
                          <td style="padding: 12px 15px 12px 0;">${purchaseDetails.discountRate || "n/a"}%</td>
                        </tr>
                        <tr>
                          <td width="150" style="padding: 12px 0 0 15px; font-weight: bold; color: #666666;">Final Price:</td>
                          <td style="padding: 12px 15px 0 0;">${purchaseDetails.discountedValue || "n/a"}</td>
                        </tr>
                      </table>
                      
                      <p style="color: #555555; font-size: 15px;">Please log in to the Staff Purchase Portal to review and approve this request.</p>
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

const parseNumber = (value) => {
  return value === "" || value == null ? null : parseFloat(value);
};

export async function POST(request) {
  let connection;
  try {
    // 1. Get the logged-in user
    const user = await getCurrentUser();
    if (!user) {
      return Response.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    connection = await pool.getConnection();
    const body = await request.json();

    // Destructure directly in the parameter list to avoid extra lines
    const [result] = await connection.execute(
      `INSERT INTO purchasesInfo 
       (staffName, user_id, user_email, payrollNo, department, itemName, itemStatus, productPolicy, productCode, tdPrice, discountRate, discountedValue, employee_payment_terms, user_credit_period, signature,HR_Approval, 
        CC_Approval, BI_Approval) 
       VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', 'pending')`,
      [
        body.staffName,
        user.id,
        user.email,
        body.payrollNo,
        body.department,
        body.itemName,
        body.itemStatus,
        body.productPolicy,
        body.productCode,
        parseNumber(body.tdPrice),
        parseNumber(body.discountRate),
        parseNumber(body.discountedValue),
        body.employee_payment_terms,
        parseNumber(body.user_credit_period),
        user.name,
      ],
    );

    // Send email notification to relevant parties (e.g., HR, approvers)
    const purchaseDetails = {
      staffName: body.staffName,
      payrollNo: body.payrollNo,
      department: body.department,
      itemName: body.itemName,
      productCode: body.productCode,
      tdPrice: parseNumber(body.tdPrice),
      discountRate: parseNumber(body.discountRate),
      discountedValue: parseNumber(body.discountedValue),
    };

    const emailHtml = generatePurchaseEmailHTML(purchaseDetails);

    // Example: Send to HR department (you might want to get this from config or DB)
    const hrEmail = process.env.HR_APPROVER;

    await sendEmail({
      to: hrEmail,
      subject: `New Purchase Request from ${body.staffName} PayrollNo: (${purchaseDetails.payrollNo})`,
      html: emailHtml,
    });

    return Response.json(
      {
        success: true,
        message: "Purchase recorded successfully and approvers notified",
        id: result.insertId,
      },
      { status: 201 }, // 201 Created for successful resource creation
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
    if (connection) connection.release();
  }
}
