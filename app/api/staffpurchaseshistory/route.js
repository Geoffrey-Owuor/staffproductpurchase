import pool from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET() {
  let connection;
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json("No User Found", { status: 200 });
    }

    connection = await pool.getConnection();

    const [rows] = await connection.execute(
      `SELECT id, itemName, itemStatus, productCode, 
              tdPrice, discountedValue, createdAt, HR_Approval, CC_Approval, BI_Approval 
       FROM purchasesInfo 
       WHERE user_id = ? 
       ORDER BY createdAt DESC`,
      [user.id],
    );

    return Response.json(rows || [], { status: 200 });
  } catch (error) {
    console.error("API Error:", error); // ✅ Add error logging
    return Response.json("Error Displaying the Data", { status: 200 });
  } finally {
    if (connection) connection.release();
  }
}
