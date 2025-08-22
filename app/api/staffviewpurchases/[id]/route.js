import { pool } from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET(request, { params }) {
  let client;

  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json("No User Found", { status: 200 });
    }

    const { id } = await params;
    client = await pool.connect();

    const { rows } = await client.query(
      `SELECT * FROM purchasesinfo WHERE id = $1 AND user_id = $2`,
      [id, user.id],
    );

    if (rows.length === 0) {
      return Response.json({ error: "Purchase not found" }, { status: 404 });
    }

    return Response.json(rows[0]);
  } catch (error) {
    console.error("Failed: ", error);
    return Response.json({ error: error.message }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}

export async function PUT(request, { params }) {
  let client;

  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json("No User Found", { status: 200 });
    }
    const { id } = await params;
    const {
      staffname,
      payrollno,
      department,
      itemname,
      itemstatus,
      productpolicy,
      productcode,
      tdprice,
      discountrate,
      discountedvalue,
      employee_payment_terms,
      user_credit_period,
    } = await request.json();

    client = await pool.connect();

    const { rowCount } = await client.query(
      `
      UPDATE purchasesinfo SET 
        staffname = $1,
        payrollno = $2,
        department = $3,
        itemname = $4,
        itemstatus = $5,
        productpolicy = $6,
        productcode = $7,
        tdprice = $8,
        discountrate = $9,
        discountedvalue = $10,
        employee_payment_terms = $11,
        user_credit_period = $12
      WHERE id = $13 AND user_id = $14
      `,
      [
        staffname || null,
        payrollno || null,
        department || null,
        itemname || null,
        itemstatus || null,
        productpolicy || null,
        productcode || null,
        tdprice || null,
        discountrate || null,
        discountedvalue || null,
        employee_payment_terms || null,
        user_credit_period || null,
        id,
        user.id,
      ],
    );

    if (rowCount === 0) {
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
    if (client) client.release();
  }
}
