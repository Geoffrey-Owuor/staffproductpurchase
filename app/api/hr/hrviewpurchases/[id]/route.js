// api/hr/hrviewpurchases/[id]/route.js
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";
import { NotificationEmail } from "@/lib/EmailNotification";

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
      return Response.json("No User Found", { status: 401 });
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
      employee_payment_terms,
      signature,
      is_employed,
      on_probation,
      hr_comments,
      hr_approval,
      hr_approver_name,
      hr_approval_date,
      hr_signature,
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
         employee_payment_terms = $10,
         signature = $11,
         is_employed = $12,
         on_probation = $13,
         hr_comments = $14,
         hr_approval = $15,
         hr_approver_name = $16,
         hr_approval_date = $17,
         hr_signature = $18,
         hr_approver_id = $19
       WHERE id = $20`,
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
        employee_payment_terms || null,
        signature || null,
        is_employed || null,
        on_probation || null,
        hr_comments || null,
        hr_approval || null,
        hr_approver_name || null,
        hr_approval_date || null,
        hr_signature || null,
        user.id,
        id,
      ],
    );

    if (rowCount === 0) {
      return Response.json({ message: "Purchase not found" }, { status: 404 });
    }

    // Send notification email after successful update
    // const emailaddress = "cc@hotpoint.com";
    // const approvalLink = `${process.env.NEXT_PUBLIC_BASE_URL}/ccdashboard`;

    // await NotificationEmail({
    //   staffname: staffname,
    //   payrollno: payrollno,
    //   itemname: itemname,
    //   itemstatus: itemstatus,
    //   tdprice: tdprice,
    //   discountedvalue: discountedvalue,
    //   approvalLink: approvalLink,
    //   emailaddress: emailaddress,
    // });

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
