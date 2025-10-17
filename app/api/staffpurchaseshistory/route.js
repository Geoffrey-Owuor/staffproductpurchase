import pool from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET(request) {
  const user = await getCurrentUser();

  let connection;
  try {
    const { searchParams } = new URL(request.url);

    const fetchAll = searchParams.get("fetchAll") === "true";
    const filterType = searchParams.get("filterType") || "approval";
    const fromDate = searchParams.get("fromDate") || null;
    const toDate = searchParams.get("toDate") || null;

    //Approval Status Param and Payment Terms param
    const approvalStatus = searchParams.get("approvalStatus") || null;
    const paymentTerms = searchParams.get("paymentTerms") || null;

    connection = await pool.getConnection();

    let query = `SELECT id, createdAt, reference_number, employee_payment_terms, payrollNo, invoicing_location, HR_Approval, CC_Approval, BI_Approval 
                 FROM purchasesInfo`;

    let params = [];
    let whereClauses = [];

    if (!fetchAll) {
      whereClauses.push(`createdAt >= NOW() - INTERVAL 12 DAY`);
    }

    //This first if statement is always true for staff roles
    if (user.role === "staff") {
      whereClauses.push(`user_id = ?`);
      params.push(user.id);
    }

    if (filterType === "date" && fromDate && toDate) {
      whereClauses.push(`DATE(createdAt) BETWEEN ? AND ?`);
      params.push(fromDate, toDate);
    } else if (filterType === "terms" && paymentTerms) {
      whereClauses.push(`employee_payment_terms = ?`);
      params.push(paymentTerms);
    }

    if (filterType === "approval" && approvalStatus) {
      if (approvalStatus === "declined") {
        whereClauses.push(`
      (BI_Approval = ? OR HR_Approval = ? OR CC_Approval = ?)
    `);
        params.push("declined", "declined", "declined");
      } else if (approvalStatus != "declined") {
        whereClauses.push(`
      BI_Approval = ? AND 
      CC_Approval <> 'declined' AND 
      HR_Approval <> 'declined'
    `);
        params.push(approvalStatus);
      }
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(" AND ")}`;
    }

    query += ` ORDER BY createdAt DESC`;

    const [rows] = await connection.execute(query, params);

    return Response.json(rows || [], { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json("Error Displaying the Data", { status: 400 });
  } finally {
    if (connection) connection.release();
  }
}
