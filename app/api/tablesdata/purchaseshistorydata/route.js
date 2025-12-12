// api/tablesdata/purchaseshistorydata/route.js
import pool from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";

//role to column mapping
const roleToColumnMap = {
  payroll: "Payroll_Approval",
  hr: "HR_Approval",
  cc: "CC_Approval",
  bi: "BI_Approval",
};

export async function GET(request) {
  const { role } = await getCurrentUser();

  if (!role) {
    return Response.json(
      { message: "No user role found or session invalid" },
      { status: 403 },
    );
  }

  let connection;
  try {
    const { searchParams } = new URL(request.url);

    const fetchAll = searchParams.get("fetchAll") === "true";
    const biApproval = searchParams.get("biApproval") === "true";
    const filterType = searchParams.get("filterType") || "staff"; //default to staff
    const searchQuery = searchParams.get("search") || "";
    const payrollNumber = searchParams.get("payrollNumber") || "";
    const referenceNumber = searchParams.get("referenceNumber") || "";
    const fromDate = searchParams.get("fromDate") || null;
    const toDate = searchParams.get("toDate") || null;

    //Approval Status Param and Payment Terms param
    const approvalStatus = searchParams.get("approvalStatus") || null;
    const paymentTerms = searchParams.get("paymentTerms") || null;

    //Credit period and request closure params
    const monthPeriod = searchParams.get("monthPeriod") || null;
    const requestClosure = searchParams.get("requestClosure") || null;

    connection = await pool.getConnection();

    let query = `SELECT id, createdAt, reference_number, staffName, payrollNo, employee_payment_terms, mpesa_code, user_credit_period, Payroll_Approval, HR_Approval, CC_Approval, BI_Approval,
         invoice_amount, request_closure
         FROM purchasesinfo`;

    let params = [];
    let whereClauses = [];

    // Conditionally add the date interval clause
    if (!fetchAll) {
      whereClauses.push(`createdAt >= NOW() - INTERVAL 12 DAY`);
    }

    if (biApproval) {
      whereClauses.push(`BI_Approval = "approved"`);
    }

    if (filterType === "staff" && searchQuery) {
      whereClauses.push(`staffName LIKE ?`);
      params.push(`%${searchQuery}%`);
    } else if (filterType === "reference" && referenceNumber) {
      whereClauses.push(`reference_number = ?`);
      params.push(referenceNumber);
    } else if (filterType === "payroll" && payrollNumber) {
      whereClauses.push(`payrollNo = ?`);
      params.push(payrollNumber);
    } else if (filterType === "date" && fromDate && toDate) {
      whereClauses.push(`DATE(createdAt) BETWEEN ? AND ?`);
      params.push(fromDate, toDate);
    } else if (filterType === "approval" && approvalStatus) {
      const columnName = roleToColumnMap[role];
      if (columnName) {
        whereClauses.push(`${columnName} = ?`);
        params.push(approvalStatus);

        //Sequential logic - Only apply if looking for pending items
        if (approvalStatus === "pending") {
          if (role === "hr") {
            whereClauses.push(`Payroll_Approval = 'approved'`);
          } else if (role === "cc") {
            whereClauses.push(`HR_Approval = 'approved'`);
          } else if (role === "bi") {
            whereClauses.push(`CC_Approval = 'approved'`);
          }
        }
      }
    } else if (filterType === "terms" && paymentTerms) {
      whereClauses.push(`employee_payment_terms = ?`);
      params.push(paymentTerms);
    } else if (filterType === "period" && monthPeriod) {
      whereClauses.push(`user_credit_period = ?`);
      params.push(Number(monthPeriod));
    } else if (filterType === "closure" && requestClosure) {
      whereClauses.push(`request_closure = ?`);
      params.push(requestClosure);
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
