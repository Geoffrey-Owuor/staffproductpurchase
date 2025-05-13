import pool from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";
import { NotificationEmail } from "@/lib/EmailNotification";

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
       hr_approver_id = ?
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
        user.id,
        id || null,
      ],
    );

    if (result.affectedRows === 0) {
      return Response.json({ message: "Purchase not found" }, { status: 404 });
    }

    // Send notification email after successful update
    // const EmailAddress = "cc@hotpoint.com";
    // const approvalLink = `${process.env.NEXT_PUBLIC_BASE_URL}/ccdashboard`;

    // await NotificationEmail({
    //   staffName: staffName,
    //   payrollNo: payrollNo,
    //   itemName: itemName,
    //   itemStatus: itemStatus,
    //   tdPrice: tdPrice,
    //   discountedValue: discountedValue,
    //   approvalLink: approvalLink,
    //   EmailAddress: EmailAddress,
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
    if (connection) connection.release();
  }
}
