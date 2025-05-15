import { pool } from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET(request, { params }) {
  let client;
  try {
    const { id } = await params;
    client = await pool.connect();

    const { rows } = await client.query(
      `SELECT * FROM purchasesinfo WHERE id = $1`,
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
    if (client) client.release();
  }
}

export async function PUT(request, { params }) {
  let client;
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json("No User Found", { status: 401 }); // Changed to 401 for unauthorized
    }

    const { id } = await params;
    const {
      staffname,
      payrollno,
      department,
      itemname,
      itemstatus,
      productcode,
      tdprice,
      discountrate,
      discountedvalue,
      date,
      signature,
      is_employed,
      on_probation,
      hr_comments,
      hr_approval,
      hr_approver_name,
      hr_approval_date,
      hr_signature,
      credit_period,
      one_third_rule,
      purchase_history_comments,
      pending_invoices,
      cc_approval,
      cc_signature,
      cc_approval_date,
      invoice_date,
      invoice_number,
      invoice_amount,
      invoice_recorded_date,
      payment_method,
      payment_reference,
      payment_date,
      amount,
      bi_signature,
      bi_approval,
    } = await request.json();

    client = await pool.connect();

    const { rowCount } = await client.query(
      `UPDATE purchasesinfo 
       SET 
       staffname = $1,
       payrollno = $2,
       department = $3,
       itemname = $4, 
       itemstatus = $5,
       productcode = $6,
       tdprice = $7,
       discountrate = $8,
       discountedvalue = $9,
       date = $10,
       signature = $11,
       is_employed = $12,
       on_probation = $13,
       hr_comments = $14,
       hr_approval = $15,
       hr_approver_name = $16,
       hr_approval_date = $17,
       hr_signature = $18,
       credit_period = $19,
       one_third_rule = $20,
       purchase_history_comments = $21,
       pending_invoices = $22,
       cc_approval = $23,
       cc_signature = $24,
       cc_approval_date = $25,
       invoice_date = $26,
       invoice_number = $27,
       invoice_amount = $28,
       invoice_recorded_date = $29,
       payment_method = $30,
       payment_reference = $31,
       payment_date = $32,
       amount = $33,
       bi_signature = $34,
       bi_approval = $35,
       bi_approver_id = $36
       WHERE id = $37`,
      [
        staffname || null,
        payrollno || null,
        department || null,
        itemname || null,
        itemstatus || null,
        productcode || null,
        tdprice || null,
        discountrate || null,
        discountedvalue || null,
        date || null,
        signature || null,
        is_employed || null,
        on_probation || null,
        hr_comments || null,
        hr_approval || null,
        hr_approver_name || null,
        hr_approval_date || null,
        hr_signature || null,
        credit_period || null,
        one_third_rule || null,
        purchase_history_comments || null,
        pending_invoices || null,
        cc_approval || null,
        cc_signature || null,
        cc_approval_date || null,
        invoice_date || null,
        invoice_number || null,
        invoice_amount || null,
        invoice_recorded_date || null,
        payment_method || null,
        payment_reference || null,
        payment_date || null,
        amount || null,
        bi_signature || null,
        bi_approval || null,
        user.id,
        id,
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
