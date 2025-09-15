import { pool } from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET(request) {
  let client;
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json("No User Found", { status: 400 });
    }

    client = await pool.connect();

    const { rows } = await client.query(
      `
      SELECT 
        COUNT(*) FILTER (WHERE cc_approval = 'pending') AS pending,
        COUNT(*) FILTER (WHERE cc_approval = 'declined' AND cc_approver_id = $1) AS declined,
        COUNT(*) FILTER (WHERE cc_approval = 'approved' AND cc_approver_id = $1) AS approved
      FROM purchasesinfo
      `,
      [user.id],
    );

    return Response.json({
      pending: Number(rows[0].pending),
      declined: Number(rows[0].declined),
      approved: Number(rows[0].approved),
    });
  } catch (error) {
    console.error("Database Error:", error);
    return Response.json(
      { error: "Failed to fetch approval counts" },
      { status: 500 },
    );
  } finally {
    if (client) client.release();
  }
}
