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

    // 2. Prepare all three concurrent query promises
    const openPromise = connection.execute(queryConfigs.openQuery);
    const closedPromise = connection.execute(queryConfigs.closedQuery);
    const approvedPromise = connection.execute(queryConfigs.approvedQuery);

    // 3. Execute all three queries in parallel
    const [[openResult], [closedResult], [approvedResult]] = await Promise.all([
      openPromise,
      closedPromise,
      approvedPromise,
    ]);

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
