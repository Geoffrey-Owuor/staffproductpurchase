import pool from "@/lib/db";

export async function PUT(_req, { params }) {
  const { id } = await params;

  if (!id) {
    return Response.json(
      { message: "Purchase Request Id is required" },
      { status: 400 },
    );
  }

  let connection;

  try {
    connection = await pool.getConnection();

    //Begin a transaction
    await connection.beginTransaction();

    //Check if the purchase request exists in the database first (And locking it for update)
    const [checkPurchase] = await connection.execute(
      `SELECT * FROM purchasesinfo WHERE id = ? FOR UPDATE`,
      [id],
    );

    if (checkPurchase.length === 0) {
      await connection.rollback();
      return Response.json(
        { message: "Purchase request not found or has been deleted" },
        { status: 404 },
      );
    }

    //Check if request was already  closed
    const [checkClosure] = await connection.execute(
      `SELECT request_closure FROM purchasesinfo WHERE id = ? and request_closure = 'closed'`,
      [id],
    );

    if (checkClosure.length > 0) {
      await connection.rollback();
      return Response.json(
        { message: "Request already closed" },
        { status: 403 },
      );
    }

    //Update the request closure to closed
    const [updateClosure] = await connection.execute(
      `UPDATE purchasesinfo SET request_closure = 'closed' WHERE id = ?`,
      [id],
    );

    if (updateClosure.affectedRows === 0) {
      await connection.rollback();
      return Response.json(
        { message: "Purchase request not found" },
        { status: 404 },
      );
    }

    //Commit the transaction
    await connection.commit();

    //Success Message
    return Response.json(
      { message: "Purchase request has been closed successfully" },
      { status: 200 },
    );
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error closing purchase request:", error);
    return Response.json(
      { message: "Error closing purchase request" },
      { status: 500 },
    );
  } finally {
    if (connection) connection.release();
  }
}
