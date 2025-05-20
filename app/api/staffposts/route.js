import { pool } from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";
import { NotificationEmail } from "@/lib/EmailNotification";

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
        tdprice, discountrate, discountedvalue, employee_payment_terms, signature, hr_approval, 
        cc_approval, bi_approval) 
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
        body.signature,
      ],
    );

    // Uncomment and adjust when ready to use email notifications
    // const emailaddress = "hr@hotpoint.com";
    // const approvalLink = `${process.env.NEXT_PUBLIC_BASE_URL}/hrdashboard`;
    // await NotificationEmail({
    //   staffname: body.staffname,
    //   payrollno: body.payrollno,
    //   itemname: body.itemname,
    //   itemstatus: body.itemstatus,
    //   tdprice: body.tdprice,
    //   discountedvalue: body.discountedvalue,
    //   approvallink: approvallink,
    //   EmailAddress: EmailAddress,
    // });

    return Response.json(
      {
        success: true,
        message: "Purchase recorded successfully",
        id: rows[0]?.id, // Return the ID even if email is commented out
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      {
        success: false,
        message: "Error recording purchase",
        error: error.message,
      },
      { status: 500 },
    );
  } finally {
    if (client) client.release();
  }
}
