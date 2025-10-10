// api/tablesdata/purchaseshistorydata/route.js
import { pool } from "@/lib/db";

export async function GET(request) {
  let client;
  try {
    const { searchParams } = new URL(request.url);
    const filterType = searchParams.get("filterType") || "staff"; //default to staff
    const searchQuery = searchParams.get("search") || "";
    const fromDate = searchParams.get("fromDate") || null;
    const toDate = searchParams.get("toDate") || null;

    client = await pool.connect();

    // Prepare the query
    let query = {
      text: `SELECT id, itemname, itemstatus, productcode, 
                    tdprice, discountedvalue, createdat, staffname, payrollno, hr_approval, cc_approval, bi_approval  
             FROM purchasesinfo`,
      values: [],
    };

    if (filterType === "staff" && searchQuery) {
      query.text += ` WHERE staffname ILIKE $1`;
      query.values.push(`%${searchQuery}%`);
    } else if (filterType === "date" && fromDate && toDate) {
      query.text += ` WHERE DATE(createdat) BETWEEN $1 AND $2`;
      query.values.push(fromDate, toDate);
    }

    // Add ordering
    query.text += ` ORDER BY createdat DESC`;

    // Execute the query
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
