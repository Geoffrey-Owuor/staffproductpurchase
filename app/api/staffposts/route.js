import pool from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";
import { NotificationEmail } from "@/lib/EmailNotification";

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
       (staffName,user_id, payrollNo, department, itemName, itemStatus, productCode, tdPrice, discountRate, discountedValue, date, signature,HR_Approval, 
        CC_Approval, BI_Approval) 
       VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', 'pending')`,
      [
        body.staffName,
        user.id,
        body.payrollNo,
        body.department,
        body.itemName,
        body.itemStatus,
        body.productCode,
        body.tdPrice,
        body.discountRate,
        body.discountedValue,
        body.date,
        body.signature,
      ],
    );

    //Send Email Notification to HR
    // const purchaseId = result.insertId;
    // const EmailAddress = "hr@hotpoint.com";
    // const approvalLink = `${process.env.NEXT_PUBLIC_BASE_URL}/hrdashboard`;
    // await NotificationEmail({
    //   staffName: body.staffName,
    //   payrollNo: body.payrollNo,
    //   itemName: body.itemName,
    //   itemStatus: body.itemStatus,
    //   tdPrice: body.tdPrice,
    //   discountedValue: body.discountedValue,
    //   approvalLink: approvalLink,
    //   EmailAddress: EmailAddress,
    // });

    return Response.json(
      {
        success: true,
        message: "Purchase recorded successfully",
        id: purchaseId,
      },
      { status: 201 }, // 201 Created for successful resource creation
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
    if (connection) connection.release();
  }
}
