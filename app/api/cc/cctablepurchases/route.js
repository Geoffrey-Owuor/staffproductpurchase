// api/cc/cctablepurchases/route.js
import { pool } from "@/lib/db";

export async function GET(request) {
  let client;
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search") || "";

    client = await pool.connect();

    // Base query with parameterized input
    let query = {
      text: `SELECT id, itemname, itemstatus, productcode, 
             tdprice, discountedvalue, createdat, staffname, payrollno, cc_approval 
             FROM purchasesinfo WHERE createdat >= NOW() - INTERVAL '12 days'`,
      values: [],
    };

    // Add search filter if provided
    if (searchQuery) {
      query.text += ` AND staffname ILIKE $1`;
      query.values.push(`%${searchQuery}%`);
    }

    // Add sorting
    query.text += ` ORDER BY createdat DESC`;

    // Execute query
    const { rows } = await client.query(query);

    return Response.json(rows || [], {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { error: "Error displaying the data", details: error.message },
      { status: 500 },
    );
  } finally {
    if (client) client.release();
  }
}
