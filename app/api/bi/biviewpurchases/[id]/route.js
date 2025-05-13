import pool from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";

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
      productCode,
      tdPrice,
      discountRate,
      discountedValue,
      date,
      signature,
      is_employed,
      on_probation,
      hr_comments,
      HR_Approval,
      hr_approver_name,
      hr_approval_date,
      hr_signature,
      credit_period,
      one_third_rule,
      purchase_history_comments,
      pending_invoices,
      CC_Approval,
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
      BI_Approval,
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
       signature = ?,
       is_employed = ?,
       on_probation = ?,
       hr_comments = ?,
       HR_Approval = ?,
       hr_approver_name = ?,
       hr_approval_date = ?,
       hr_signature = ?,
       credit_period = ?,
       one_third_rule = ?,
       purchase_history_comments = ?,
       pending_invoices = ?,
       CC_Approval = ?,
       cc_signature = ?,
       cc_approval_date = ?,
       invoice_date = ?,
       invoice_number = ? ,
       invoice_amount = ? ,
       invoice_recorded_date = ?,
       payment_method = ?,
       payment_reference = ?,
       payment_date = ?,
       amount = ?,
       bi_signature = ?,
       BI_Approval = ?,
       bi_approver_id = ?
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
        is_employed || null,
        on_probation || null,
        hr_comments || null,
        HR_Approval || null,
        hr_approver_name || null,
        hr_approval_date || null,
        hr_signature || null,
        credit_period || null,
        one_third_rule || null,
        purchase_history_comments || null,
        pending_invoices || null,
        CC_Approval || null,
        cc_signature || null,
        cc_approval_date || null,
        invoice_date,
        invoice_number,
        invoice_amount,
        invoice_recorded_date,
        payment_method,
        payment_reference,
        payment_date,
        amount,
        bi_signature,
        BI_Approval,
        user.id,
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
