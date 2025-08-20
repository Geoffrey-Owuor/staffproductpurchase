// api/hr/hrtablepurchases/route.js
import pool from "@/lib/db";

export async function GET(request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search") || "";

    connection = await pool.getConnection();

    let query = `SELECT id, itemName, itemStatus, productCode, 
                tdPrice, discountedValue, createdAt, staffName, payrollNo, HR_Approval, CC_Approval, BI_Approval  
         FROM purchasesInfo WHERE createdAt >= NOW() - INTERVAL 12 DAY`;

    let params = [];

    if (searchQuery) {
      query += ` AND staffName LIKE ?`;
      params.push(`%${searchQuery}%`);
    }

    query += ` ORDER BY createdAt DESC`;

    const [rows] = await connection.execute(query, params);

    return Response.json(rows || [], { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json("Error Displaying the Data", { status: 400 });
  } finally {
    if (connection) connection.release();
  }
}
