import { pool } from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET() {
  let client;
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json("No User Found", { status: 200 });
    }

    client = await pool.connect();

    const { rows } = await client.query(
      `SELECT id, itemname, itemstatus, productcode, 
              tdprice, discountedvalue, createdat, hr_approval, cc_approval, bi_approval 
       FROM purchasesinfo 
       WHERE user_id = $1
       ORDER BY createdat DESC`,
      [user.id],
    );

    return Response.json(rows || [], { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json("Error Displaying the Data", { status: 500 }); // Changed to 500 for server errors
  } finally {
    if (client) client.release();
  }
}
