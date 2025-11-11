import pool from "@/lib/db";

export async function DELETE(_req, { params }) {
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

    //Begin the transaction
    await connection.beginTransaction();

    //Check if the purchase request exists in the database first (And locking it for update)
    const [checkPurchase] = await connection.execute(
      `SELECT * FROM purchasesinfo WHERE id = ? FOR UPDATE`,
      [id],
    );

    if (checkPurchase.length === 0) {
      await connection.rollback();
      return Response.json(
        { message: "Purchase request not found or is deleted" },
        { status: 404 },
      );
    }

    //Check if biApproval is approved for the purchase about to be deleted
    const [biApproval] = await connection.execute(
      "SELECT BI_Approval from purchasesinfo WHERE id = ? AND BI_Approval = 'approved'",
      [id],
    );

    if (biApproval.length > 0) {
      await connection.rollback();
      return Response.json(
        {
          message:
            "Can't delete a purchase request already approved by invoicing",
        },
        { status: 400 },
      );
    }

    //Delete associated products from the purchase_products table (Deleted first to avoid foreign key error constraints)
    const [deletedProducts] = await connection.execute(
      "DELETE FROM purchase_products WHERE purchase_id = ?",
      [id],
    );

    if (deletedProducts.affectedRows === 0) {
      await connection.rollback();
      return Response.json({ message: "Products not found" }, { status: 404 });
    }

    //Delete the record from the purchasesinfo table
    const [result] = await connection.execute(
      "DELETE FROM purchasesinfo WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return Response.json({ message: "Purchase not found" }, { status: 404 });
    }

    //Commit transactions if both deletions succeed
    await connection.commit();

    //Success message
    return Response.json(
      { message: "Purchase request has been deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("API Deletion Error:", error);
    return Response.json(
      { message: "Error Deleting the Purchase Request" },
      { status: 500 },
    );
  } finally {
    if (connection) connection.release();
  }
}
