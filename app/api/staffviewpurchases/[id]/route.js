import pool from "@/lib/db";

export async function GET(request, { params }) {
  let connection;

  try {
    const { id } = await params;
    connection = await pool.getConnection();

    const [rows] = await connection.execute(
      `SELECT * FROM purchasesInfo WHERE id= ?`,
      [id],
    );

    if (rows.length === 0) {
      return Response.json({ error: "Purchase not found" }, { status: 404 });
    }
    return Response.json(rows[0]);
  } catch (error) {
    console.error("Failed: ", error);
    return Response.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function PUT(request, { params }) {
  let connection;
  try {
    const { id } = await params;
    const {
      staffName,
      payrollNo,
      department,
      itemName,
      itemStatus,
      productCode,
      tdPrice,
      discountRate,
      discountedValue,
      date,
      signature,
    } = await request.json();
    connection = await pool.getConnection();

    const [result] = await connection.execute(
      `UPDATE purchasesInfo 
       SET 
       staffName = ?,
       payrollNo = ?,
       department = ?,
       itemName = ?, 
       itemStatus = ?,
       productCode = ?,
       tdPrice = ?,
       discountRate= ?,
       discountedValue = ?,
       date = ?,
       signature = ?
       WHERE id = ? 
       `,
      [
        staffName || null,
        payrollNo || null,
        department || null,
        itemName || null,
        itemStatus || null,
        productCode || null,
        tdPrice || null,
        discountRate || null,
        discountedValue || null,
        date || null,
        signature || null,
        id || null,
      ],
    );

    if (result.affectedRows === 0) {
      return Response.json({ message: "Purchase not found" }, { status: 404 });
    }
    return Response.json(
      { message: "Purchase Updated Successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Database Error:", error);
    return Response.json(
      { message: "Error updating purchase", error: error.message },
      { status: 500 },
    );
  } finally {
    if (connection) connection.release();
  }
}
