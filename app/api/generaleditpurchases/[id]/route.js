import pool from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";
import { ApproversEmailHandler } from "@/lib/Email/ApproversEmailHandler";

const parseNumber = (value) => {
  return value === "" || value == null ? null : parseFloat(value);
};

export async function PUT(request, { params }) {
  const { id } = await params;
  let connection;

  let oldData;
  let user;

  user = await getCurrentUser();

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction(); //Beginning a new query transaction

    //1. Get current state of the purchase before any updates
    const [currentPurchaseRows] = await connection.execute(
      `SELECT * FROM purchasesInfo WHERE id = ? FOR UPDATE`, //Locking the row for update
      [id],
    );
    if (currentPurchaseRows.length === 0) {
      await connection.rollback();
      return Response.json({ message: "Purchase not found" }, { status: 404 });
    }
    oldData = currentPurchaseRows[0];

    //Approval Check to make sure there is no further update after approval by various roles/approvers

    const approvalFieldForRole = {
      payroll: "Payroll_Approval",
      hr: "HR_Approval",
      cc: "CC_Approval",
      bi: "BI_Approval",
    };

    const roleField = approvalFieldForRole[user.role];

    //Check if current role has an approval field and if the value in the database is already approved
    if (roleField && oldData[roleField] === "approved") {
      //role has already approved, stop any further updates
      //Explicitly roll back the transaction to release the row lock
      await connection.rollback();

      return Response.json(
        { message: "Purchase request already approved by your department" },
        { status: 403 },
      );
    }

    //Get the full json payload from the frontend
    const newData = await request.json();
    const { products, ...purchaseData } = newData;

    //DYNAMICALLY BUILD SQL QUERY BASED ON USER ROLE

    //Allowed stores fields each role is allowed to update
    const allowedFields = {
      payroll: ["one_third_rule", "Payroll_Approval"],
      hr: ["is_employed", "on_probation", "hr_comments", "HR_Approval"],
      cc: [
        "credit_period",
        "purchase_history_comments",
        "pending_invoices",
        "CC_Approval",
      ],
      bi: [
        "invoice_date",
        "invoice_number",
        "invoice_amount",
        "payment_reference",
        "invoicing_location",
        "mpesa_code",
        "BI_Approval",
      ],
    };

    //Tracking fields that require a numeric database value
    const numericFields = ["user_credit_period"];

    //Check if role has fields it can update
    const fieldsForUpdate = allowedFields[user.role];

    if (!fieldsForUpdate) {
      await connection.rollback();
      return Response.json(
        { message: "Invalid user role for this action" },
        { status: 403 },
      );
    }

    const setClauses = [];
    const queryParams = [];

    //Push valid PurchaseData fields into the setClauses Array and queryParams Array
    for (const field of fieldsForUpdate) {
      if (purchaseData[field] !== undefined) {
        //Making sure the received data does not have any undefined in it and is in purchaseData
        let value = purchaseData[field];

        if (numericFields.includes(field)) {
          value = parseNumber(value);
        }
        setClauses.push(`${field} = ?`);
        queryParams.push(value);
      }
    }

    //Refactored Logic to add Approver Details
    const approverConfig = {
      payroll: {
        approvalField: "Payroll_Approval",
        prefix: "payroll",
      },
      hr: {
        approvalField: "HR_Approval",
        prefix: "hr",
      },
      cc: {
        approvalField: "CC_Approval",
        prefix: "cc",
      },
      bi: {
        approvalField: "BI_Approval",
        prefix: "bi",
      },
    };

    const roleConfig = approverConfig[user.role];
    if (roleConfig && purchaseData[roleConfig.approvalField]) {
      const prefix = roleConfig.prefix;
      const approverName = purchaseData[`${prefix}_approver_name`] || user.name;

      //Correctly push clauses and params
      setClauses.push(
        `${prefix}_approver_name = ?`,
        `${prefix}_approver_email = ?`,
        `${prefix}_approver_id = ?`,
        `${prefix}_signature = ?`,
        `${prefix}_approval_date = CURRENT_TIMESTAMP`,
      );
      queryParams.push(approverName, user.email, user.id, user.name);
    }

    //Run the update query after building the clause and params
    if (setClauses.length > 0) {
      const updateQuery = `UPDATE purchasesInfo SET ${setClauses.join(", ")} WHERE id = ?`;
      queryParams.push(id);
      await connection.execute(updateQuery, queryParams);
    }

    //UPDATE THE PRODUCTS TABLE (ONLY WHEN USER IS BI)
    if (user.role === "cc" && Array.isArray(products) && products.length > 0) {
      //Delete the existing products for this purchase
      await connection.execute(
        "DELETE FROM purchase_products WHERE purchase_id = ?",
        [id],
      );

      //Insert new products into the table (per product)
      const itemInsertPromises = products.map((product) => {
        return connection.execute(
          `INSERT INTO purchase_products
        (purchase_id, itemName, itemStatus, productPolicy, productCode, tdPrice, discountRate, discountedValue)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            product.itemName,
            product.itemStatus,
            product.productPolicy,
            product.productCode,
            parseNumber(product.tdPrice),
            parseNumber(product.discountRate),
            parseNumber(product.discountedValue),
          ],
        );
      });

      await Promise.all(itemInsertPromises);
    }

    //If all succeed, commit the transaction
    await connection.commit();

    // 5. --- FIRE-AND-FORGET ---
    // Call the handler but DO NOT await it.
    // The code will continue immediately to the return statement.
    ApproversEmailHandler({
      user,
      oldData,
      newData,
    });

    return Response.json(
      {
        message:
          "Purchase request has been updated successfully, redirecting...",
      },
      { status: 200 },
    );
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("API Error Updating Purchase: ", error);
    return Response.json(
      { message: "Error Updating Purchase Request" },
      { status: 500 },
    );
  } finally {
    if (connection) connection.release();
  }
}
