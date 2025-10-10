import pool from "@/lib/db";

export async function GET(_req, { params }) {
  let connection;

  try {
    const { id } = await params;
    connection = await pool.getConnection();

    //Query 1: Main purchase details from purchasesInfo
    const [purchaseRows] = await connection.execute(
      `SELECT * FROM purchasesInfo WHERE id= ?`,
      [id],
    );

    if (purchaseRows.length === 0) {
      return Response.json({ error: "Purchase not found" }, { status: 404 });
    }
    const purchaseDetails = purchaseRows[0];

    //Query 2: Getting product details
    const [productRows] = await connection.execute(
      `
    SELECT
    itemName,
    itemStatus,
    productPolicy,
    productCode,
    tdPrice,
    discountRate,
    discountedValue
    FROM purchase_products
    WHERE purchase_id = ?
      `,
      [id],
    );

    //Combine results into a single object
    const responseData = {
      ...purchaseDetails,
      products: productRows,
    };

    return Response.json(responseData);
  } catch (error) {
    console.error("Failed: ", error);
    return Response.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
