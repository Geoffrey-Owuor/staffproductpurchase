import pool from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET(request) {
  let connection;
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json("No User Found", { status: 400 });
    }

    connection = await pool.getConnection();

    // Get counts for each approval status
    const [pending] = await connection.execute(
      `SELECT COUNT(*) as count FROM purchasesInfo 
       WHERE BI_Approval = 'pending'`,
    );

    const [declined] = await connection.execute(
      `SELECT COUNT(*) as count FROM purchasesInfo 
       WHERE BI_Approval = 'declined' AND bi_approver_id = ?`,
      [user.id],
    );

    const [approved] = await connection.execute(
      `SELECT COUNT(*) as count FROM purchasesInfo 
       WHERE BI_Approval = 'approved' AND bi_approver_id = ?`,
      [user.id],
    );

    return Response.json({
      pending: pending[0].count,
      declined: declined[0].count,
      approved: approved[0].count,
    });
  } catch (error) {
    console.error("Database Error:", error);
    return Response.json(
      { error: "Failed to fetch approval counts" },
      { status: 500 },
    );
  } finally {
    if (connection) connection.release();
  }
}
