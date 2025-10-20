import ExcelJS from "exceljs";
import pool from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  //filters and searchqueries
  const exportAll = searchParams.get("exportAll") === "true";
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  //the base select clause for both scenarios
  const baseSelect = `
    SELECT
      p.id AS purchaseId, p.createdAt, p.reference_number, p.staffName,
      p.payrollNo, p.department, p.employee_payment_terms,
      p.user_credit_period, p.invoicing_location, p.delivery_details,
      p.credit_period, p.pending_invoices, p.invoice_number, p.invoice_amount,
      p.payment_reference, p.amount, p.payment_balance, p.payment_completion,
      pp.itemName, pp.itemStatus, pp.productPolicy, pp.productCode, pp.tdPrice,
      pp.discountRate, pp.discountedValue
    FROM purchasesinfo AS p
    INNER JOIN purchase_products AS pp ON p.id = pp.purchase_id
  `;

  let query = baseSelect;
  let params = [];
  let whereClauses = [];

  //Add BI_Approval condition if not exporting all data
  if (!exportAll) {
    whereClauses.push(`p.BI_Approval = 'approved'`);
  }

  //Add date range condition if both dates are provided
  if (fromDate && toDate) {
    whereClauses.push(`DATE(p.createdAt) BETWEEN ? AND ?`);
    params.push(fromDate, toDate);
  }

  //Combine the whereclauses
  if (whereClauses.length > 0) {
    query += ` WHERE ${whereClauses.join(" AND ")}`;
  }

  //Add ORDER BY clause
  query += ` ORDER BY p.createdAt DESC`;

  let connection;

  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(query, params);

    //Create a new workook with excelJS and add a new worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Purchases");

    // 3. Define the columns for the worksheet
    if (rows.length > 0) {
      worksheet.columns = Object.keys(rows[0]).map((key) => ({
        header: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()), // Format header text (e.g., "purchaseId" -> "Purchase Id")
        key: key,
        width: 20, // Set a default column width
      }));

      // 4. Add the data rows
      worksheet.addRows(rows);
    }

    // 5. Generate the buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // --- Send the file as a response ---
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="purchase_data.xlsx"',
      },
    });
  } catch (error) {
    console.error("Failed to export data:", error);
    return Response.json(
      { message: "Failed to export data to excel" },
      { status: 500 },
    );
  } finally {
    if (connection) connection.release();
  }
}
