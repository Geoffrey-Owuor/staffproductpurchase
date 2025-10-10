// api/tablesdata/purchaseshistorydata/route.js
import pool from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";

//role to column mapping
const roleToColumnMap = {
  hr: "HR_Approval",
  cc: "CC_Approval",
  bi: "BI_Approval",
};

export async function GET(request) {
  const { role } = await getCurrentUser();

  let connection;
  try {
    const { searchParams } = new URL(request.url);

    const fetchAll = searchParams.get("fetchAll") === "true";
    const filterType = searchParams.get("filterType") || "staff"; //default to staff
    const searchQuery = searchParams.get("search") || "";
    const fromDate = searchParams.get("fromDate") || null;
    const toDate = searchParams.get("toDate") || null;

    //Approval Status Param and Payment Terms param
    const approvalStatus = searchParams.get("approvalStatus") || null;
    const paymentTerms = searchParams.get("paymentTerms") || null;

    connection = await pool.getConnection();

    let query = `SELECT id, createdAt, staffName, employee_payment_terms, HR_Approval, CC_Approval, BI_Approval
         FROM purchasesInfo`;

    let params = [];
    let whereClauses = [];

    // Conditionally add the date interval clause
    if (!fetchAll) {
      whereClauses.push(`createdAt >= NOW() - INTERVAL 12 DAY`);
    }

    if (filterType === "staff" && searchQuery) {
      whereClauses.push(`staffName LIKE ?`);
      params.push(`%${searchQuery}%`);
    } else if (filterType === "date" && fromDate && toDate) {
      whereClauses.push(`DATE(createdAt) BETWEEN ? AND ?`);
      params.push(fromDate, toDate);
    } else if (filterType === "approval" && approvalStatus) {
      const columnName = roleToColumnMap[role];
      if (columnName) {
        whereClauses.push(`${columnName} = ?`);
        params.push(approvalStatus);
      }
    } else if (filterType === "terms" && paymentTerms) {
      whereClauses.push(`employee_payment_terms = ?`);
      params.push(paymentTerms);
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
