import pool from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";
import { sendEmail } from "@/lib/emailSender";
import generatePurchaseEmailHTML from "@/utils/EmailTemplates/StaffEmails/SendtoHrEmails";
import generateUserPurchaseEmailHTML from "@/utils/EmailTemplates/StaffEmails/SendtoStaffEmail";

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
    const { staffInfo, products, paymentInfo } = await request.json();

    //Start a transaction
    await connection.beginTransaction();

    // Destructure directly in the parameter list to avoid extra lines
    const [result] = await connection.execute(
      `INSERT INTO purchasesInfo 
       (staffName, user_id, user_email, payrollNo, department, employee_payment_terms, user_credit_period, invoicing_location, delivery_details, signature, HR_Approval, 
        CC_Approval, BI_Approval) 
       VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', 'pending')`,
      [
        staffInfo.staffName,
        user.id,
        user.email,
        staffInfo.payrollNo,
        staffInfo.department,
        paymentInfo.employee_payment_terms,
        parseNumber(paymentInfo.user_credit_period),
        paymentInfo.invoicing_location,
        paymentInfo.delivery_details,
        user.name,
      ],
    );

    //Get the resultant inserted id (Next auto_inceremented value)
    const insertedId = result.insertId;

    //Run an update query to insert reference_number into purchasesinfo
    await connection.execute(
      `UPDATE purchasesinfo 
       SET reference_number = ? 
       WHERE increment_id = ?`,
      [`PRQST-${insertedId}`, insertedId],
    );

    //Get the purchase (id) from purchasesinfo table
    const [rows] = await connection.execute(
      `SELECT id from purchasesInfo
       WHERE user_email = ?
       ORDER BY createdAt DESC
       LIMIT 1`,
      [user.email],
    );

    const generatedId = rows[0]?.id;

    //Insert each product/item into the purchase_products table

    const itemInsertPromises = products.map((product) => {
      return connection.execute(
        `INSERT INTO purchase_products
        (purchase_id, itemName, itemStatus, productPolicy, productCode, tdPrice, discountRate, discountedValue)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          generatedId,
          product.itemName,
          product.itemStatus,
          product.productPolicy,
          product.productCode,
          parseNumber(product.tdPrice),
          parseNumber(product.discountRate),
          parseNumber(product.discountedValue),
        ],
      );
    });

    await Promise.all(itemInsertPromises);

    //If all inserts succeed, commit the transaction
    await connection.commit();

    const emailHtml = generatePurchaseEmailHTML({
      staffInfo: staffInfo,
      products: products,
    });
    const userEmailHtml = generateUserPurchaseEmailHTML({
      staffInfo: staffInfo,
      products: products,
    });

    //Send email to HR department
    const hrEmail = process.env.HR_APPROVER;

    await sendEmail({
      to: hrEmail,
      subject: `New Purchase Request from ${staffInfo.staffName} PayrollNo: (${staffInfo.payrollNo})`,
      html: emailHtml,
    });

    //Send email to the user
    await sendEmail({
      to: user.email,
      subject: `Purchase Request Submitted Successfully, PayrollNo: (${staffInfo.payrollNo})`,
      html: userEmailHtml,
    });

    return Response.json(
      {
        success: true,
        message: "Purchase request sent successfully",
        id: generatedId,
      },
      { status: 201 }, // 201 Created for successful resource creation
    );
  } catch (error) {
    if (connection) await connection.rollback();
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
