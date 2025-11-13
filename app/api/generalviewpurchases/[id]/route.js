import pool from "@/lib/db";

export async function GET(_req, { params }) {
  let connection;

  try {
    const { id } = await params;
    connection = await pool.getConnection();

    //Create main purchasesinfo promise
    const purchasePromise = connection.execute(
      `SELECT * FROM purchasesInfo WHERE id= ?`,
      [id],
    );

    //The purchase_products promise
    const productsPromise = connection.execute(
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

    // Execute both queries in parallel using promise.all
    const [[purchaseRows], [productRows]] = await Promise.all([
      purchasePromise,
      productsPromise,
    ]);

    if (purchaseRows.length === 0) {
      return Response.json({ error: "Purchase not found" }, { status: 404 });
    }
    const purchaseDetails = purchaseRows[0];

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
