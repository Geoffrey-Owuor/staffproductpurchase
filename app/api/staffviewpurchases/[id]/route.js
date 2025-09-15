import pool from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET(request, { params }) {
  let connection;

  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json("No User Found", { status: 200 });
    }
    const { id } = await params;
    connection = await pool.getConnection();

    const [rows] = await connection.execute(
      `SELECT * FROM purchasesInfo WHERE id= ? AND user_id = ? `,
      [id, user.id],
    );

    if (rows.length === 0) {
      return Response.json(
        { error: "Purchase Not Found Under Current User" },
        { status: 404 },
      );
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
    const user = await getCurrentUser();

    if (!user) {
      return Response.json("No User Found", { status: 200 });
    }
    const { id } = await params;
    const {
      staffName,
      payrollNo,
      department,
      itemName,
      itemStatus,
      productPolicy,
      productCode,
      tdPrice,
      discountRate,
      discountedValue,
      employee_payment_terms,
      user_credit_period,
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
       productPolicy = ?,
       productCode = ?,
       tdPrice = ?,
       discountRate= ?,
       discountedValue = ?,
       employee_payment_terms = ?,
       user_credit_period = ?
       WHERE id = ? AND user_id = ?
       `,
      [
        staffName || null,
        payrollNo || null,
        department || null,
        itemName || null,
        itemStatus || null,
        productPolicy || null,
        productCode || null,
        tdPrice || null,
        discountRate || null,
        discountedValue || null,
        employee_payment_terms || null,
        user_credit_period || null,
        id,
        user.id,
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
