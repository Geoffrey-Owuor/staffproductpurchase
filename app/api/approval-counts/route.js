//NEW REUSABLE APPROVAL COUNTS QUERY FOR ALL ROLES (staff, hr, cc, bi)
import pool from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";

const ROLE_QUERY_CONFIGS = {
  bi: {
    approvalField: "BI_Approval",
    approverIdField: "bi_approver_id",
  },
  cc: {
    approvalField: "CC_Approval",
    approverIdField: "cc_approver_id",
  },
  hr: {
    approvalField: "HR_Approval",
    approverIdField: "hr_approver_id",
  },
  payroll: {
    approvalField: "Payroll_Approval",
    approverIdField: "payroll_approver_id",
  },

  // Staff functions - they see the approval status of their submitted requests
  staff: {
    getPendingQuery: (userId) => ({
      sql: `SELECT COUNT(*) as count FROM purchasesInfo 
            WHERE user_id = ? 
            AND BI_Approval = 'pending' 
            AND CC_Approval <> 'declined' 
            AND HR_Approval <> 'declined'
            AND Payroll_Approval <> 'declined'`,
      params: [userId],
    }),
    getDeclinedQuery: (userId) => ({
      sql: `SELECT COUNT(*) as count FROM purchasesInfo 
            WHERE user_id = ? AND (
            BI_Approval = 'declined' OR 
            HR_Approval = 'declined' OR 
            CC_Approval = 'declined' OR
            Payroll_Approval = 'declined')`,
      params: [userId],
    }),
    getApprovedQuery: (userId) => ({
      sql: `SELECT COUNT(*) as count FROM purchasesInfo 
            WHERE user_id = ? 
            AND BI_Approval = 'approved' 
            AND CC_Approval <> 'declined' 
            AND HR_Approval <> 'declined'
            AND Payroll_Approval <> 'declined'`,
      params: [userId],
    }),
  },
};

//Generate SQL query configs for approver roles
function getApproverQueryConfigs(role, approvalField, approverIdField, userId) {
  // The dependency chain
  // A role only sees a request when the previous person has approved it
  let prerequisiteClause = "";

  switch (role) {
    case "hr":
      prerequisiteClause = "AND Payroll_Approval = 'approved'";
      break;
    case "cc":
      prerequisiteClause = "AND HR_Approval = 'approved'";
      break;
    case "bi":
      prerequisiteClause = "AND CC_Approval = 'approved'";
      break;
    case "payroll":
      prerequisiteClause = "";
      break;
    default:
      prerequisiteClause = "";
  }

  return {
    pending: {
      sql: `SELECT COUNT(*) as count FROM purchasesInfo 
            WHERE ${approvalField} = 'pending' 
            ${prerequisiteClause}`,
      params: [],
    },
    declined: {
      sql: `SELECT COUNT(*) as count FROM purchasesInfo 
            WHERE ${approvalField} = 'declined' AND ${approverIdField} = ?`,
      params: [userId],
    },
    approved: {
      sql: `SELECT COUNT(*) as count FROM purchasesInfo 
            WHERE ${approvalField} = 'approved' AND ${approverIdField} = ?`,
      params: [userId],
    },
  };
}

export async function GET(request) {
  let connection;
  try {
    const { role, id: userId } = await getCurrentUser();

    //Check if current user is authenticated
    if (!role || !userId) {
      return Response.json(
        { message: "User is not authenticated" },
        { status: 401 },
      );
    }

    const roleConfig = ROLE_QUERY_CONFIGS[role];

    if (!roleConfig) {
      return Response.json({ message: "Invalid user role" }, { status: 403 });
    }

    let queryConfigs = {};

    //Determining query strategy based on role type
    if (role === "staff") {
      //staff role uses specific combined queries
      queryConfigs = {
        pending: roleConfig.getPendingQuery(userId),
        declined: roleConfig.getDeclinedQuery(userId),
        approved: roleConfig.getApprovedQuery(userId),
      };
    } else if (roleConfig.approvalField && roleConfig.approverIdField) {
      //Approvers use the generic approver query generator
      queryConfigs = getApproverQueryConfigs(
        role,
        roleConfig.approvalField,
        roleConfig.approverIdField,
        userId,
      );
    } else {
      //Fallback for unidentified configuration
      return Response.json(
        { message: "Role configuration error" },
        { status: 500 },
      );
    }

    //Execute queries
    connection = await pool.getConnection();

    // Prepare all three concurrent query promises
    const pendingPromise = connection.execute(
      queryConfigs.pending.sql,
      queryConfigs.pending.params,
    );
    const declinedPromise = connection.execute(
      queryConfigs.declined.sql,
      queryConfigs.declined.params,
    );
    const approvedPromise = connection.execute(
      queryConfigs.approved.sql,
      queryConfigs.approved.params,
    );

    // Execute all three queries in parallel
    const [[pendingResult], [declinedResult], [approvedResult]] =
      await Promise.all([pendingPromise, declinedPromise, approvedPromise]);

    //Return the combined result
    return Response.json({
      pending: pendingResult[0].count,
      declined: declinedResult[0].count,
      approved: approvedResult[0].count,
    });
  } catch (error) {
    console.error("Database Error: ", error);
    return Response.json(
      { message: "Failed to fetch Approval Counts" },
      { status: 500 },
    );
  } finally {
    if (connection) connection.release();
  }
}
