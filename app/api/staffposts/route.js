import pool from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";
import { sendEmail } from "@/lib/emailSender";
import { CachedEmails } from "@/utils/Cache/CachedConditions";
import generatePurchaseEmailHTML from "@/utils/EmailTemplates/StaffEmails/SendtoPayrollEmail";
import generateUserPurchaseEmailHTML from "@/utils/EmailTemplates/StaffEmails/SendtoStaffEmail";
import generateCCDirectEmailHTML from "@/utils/EmailTemplates/CCDirectEmail/CCDirectEmail";

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
       (staffName, user_id, user_email, payrollNo, department, employee_payment_terms, mpesa_code, user_credit_period, invoicing_location, delivery_details, signature, Payroll_Approval, HR_Approval, 
        CC_Approval, BI_Approval, request_closure) 
       VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', 'pending', 'pending', 'open')`,
      [
        staffInfo.staffName,
        user.id,
        user.email,
        staffInfo.payrollNo,
        staffInfo.department,
        paymentInfo.employee_payment_terms,
        paymentInfo.mpesa_code,
        parseNumber(paymentInfo.user_credit_period),
        paymentInfo.invoicing_location,
        paymentInfo.delivery_details,
        user.name,
      ],
    );

    //Get the resultant inserted id (Next auto_inceremented value)
    const insertedId = result.insertId;
    const referenceNumber = `PRQ-${insertedId}`;

    //Run an update query to insert reference_number into purchasesinfo
    await connection.execute(
      `UPDATE purchasesinfo 
       SET reference_number = ? 
       WHERE increment_id = ?`,
      [referenceNumber, insertedId],
    );

    //Get the purchase (id) from purchasesinfo table
    const [rows] = await connection.execute(
      `SELECT id from purchasesInfo
       WHERE reference_number = ?`,
      [referenceNumber],
    );

    const purchaseId = rows[0]?.id;
    if (!purchaseId) {
      // Failsafe
      await connection.rollback();
      return Response.json(
        { success: false, message: "Failed to retrieve final purchase ID." },
        { status: 500 },
      );
    }

    //Insert each product/item into the purchase_products table

    const itemInsertPromises = products.map((product) => {
      return connection.execute(
        `INSERT INTO purchase_products
        (purchase_id, itemName, itemStatus, productPolicy, productCode, tdPrice, discountRate, discountedValue)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          purchaseId,
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

    //If payment terms is cash, autofill both payroll and hr data with default values
    if (paymentInfo.employee_payment_terms === "CASH") {
      await connection.execute(
        `
        UPDATE purchasesinfo
        SET 
        payroll_approver_name = 'auto approval', 
        payroll_approver_email = 'auto approval',
        payroll_signature = 'auto approval',
        payroll_approval_date = CURRENT_TIMESTAMP,
        Payroll_Approval = 'approved',
        one_third_rule = 'not applicable, cash payment',
        hr_approver_name = 'auto approval',
        hr_approver_email = 'auto approval',
        hr_signature = 'auto approval',
        hr_approval_date = CURRENT_TIMESTAMP,
        is_employed = 'cash approval',
        on_probation = 'cash approval',
        HR_Approval = 'approved',
        hr_comments = 'approved cash payment'
        WHERE increment_id = ?
        `,
        [insertedId],
      );
    }

    //If all inserts succeed, commit the transaction
    await connection.commit();

    //Payroll email html
    const emailHtml = generatePurchaseEmailHTML({
      staffInfo: staffInfo,
      products: products,
    });

    //User Email html
    const userEmailHtml = generateUserPurchaseEmailHTML({
      staffInfo: staffInfo,
      products: products,
    });

    //emailHtml to send to credit control if payment terms is cash
    const ccEmailHtml = generateCCDirectEmailHTML({
      staffInfo: staffInfo,
      products: products,
    });

    //Getting approver emails required
    const emails = await CachedEmails();
    const payrollEmail = emails[0].approver_email;
    const ccEmail = emails[2].approver_email;

    // Email sending promises array
    const emailPromises = [];

    //IF STATEMENT which checks payment terms type to send an appropriate email (To credit control or to HR)
    if (paymentInfo.employee_payment_terms === "CASH") {
      emailPromises.push(
        sendEmail({
          to: ccEmail,
          subject: `New Purchase Request ${staffInfo.staffName} PayrollNo: (${staffInfo.payrollNo})`,
          html: ccEmailHtml,
        }),
      );
    } else {
      emailPromises.push(
        sendEmail({
          to: payrollEmail,
          subject: `New Purchase Request from ${staffInfo.staffName} PayrollNo: (${staffInfo.payrollNo})`,
          html: emailHtml,
        }),
      );
    }

    //Send email to the user
    emailPromises.push(
      sendEmail({
        to: user.email,
        subject: `Purchase Request Submitted Successfully, PayrollNo: (${staffInfo.payrollNo})`,
        html: userEmailHtml,
      }),
    );

    //Send the emails
    await Promise.all(emailPromises);

    return Response.json(
      {
        success: true,
        message: "Your purchase request has been submitted successfully",
        id: purchaseId,
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
