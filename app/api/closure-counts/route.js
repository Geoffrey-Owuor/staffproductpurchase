import pool from "@/lib/db";

//Query Building (Prepared Statements)

const queryConfigs = {
  openQuery: `SELECT COUNT(*) as count FROM purchasesinfo
              WHERE BI_Approval = 'approved' AND request_closure = 'open'`,

  closedQuery: `SELECT COUNT(*) as count FROM purchasesinfo
                WHERE BI_Approval = 'approved' AND request_closure = 'closed'`,

  approvedQuery: `SELECT COUNT(*) as count FROM purchasesinfo
                  WHERE BI_Approval = 'approved'`,
};

export async function GET(_req) {
  let connection;

  try {
    connection = await pool.getConnection();

    //Running the prepared statements
    const [openResult] = await connection.execute(queryConfigs.openQuery);
    const [closedResult] = await connection.execute(queryConfigs.closedQuery);
    const [approvedResult] = await connection.execute(
      queryConfigs.approvedQuery,
    );

    //Returning the combined result
    return Response.json({
      open: openResult[0].count,
      closed: closedResult[0].count,
      approved: approvedResult[0].count,
    });
  } catch (error) {
    console.error("Error fetching closure counts:", error);
    return Response.json(
      { message: "Failed to fetch closure counts" },
      { status: 500 },
    );
  } finally {
    if (connection) connection.release();
  }
}
