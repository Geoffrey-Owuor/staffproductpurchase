// import pool from "@/lib/db";
// import { getCurrentUser } from "@/app/lib/auth";

// export async function GET(_req) {
//   let connection;
//   try {
//     const user = await getCurrentUser();
//     if (!user) {
//       return Response.json("No User Found", { status: 400 });
//     }

//     connection = await pool.getConnection();

//     // Get counts for each approval status
//     const [pending] = await connection.execute(
//       `SELECT COUNT(*) as count FROM purchasesInfo
//        WHERE user_id = ? AND BI_Approval = 'pending' AND
//        CC_Approval <> 'declined' AND HR_Approval <> 'declined'
//        `,
//       [user.id],
//     );

//     const [declined] = await connection.execute(
//       `SELECT COUNT(*) as count FROM purchasesInfo
//          WHERE user_id = ? AND (
//          BI_Approval = 'declined' OR
//          HR_Approval = 'declined' OR
//          CC_Approval = 'declined'
//    )`,
//       [user.id],
//     );

//     const [approved] = await connection.execute(
//       `SELECT COUNT(*) as count FROM purchasesInfo
//        WHERE user_id = ? AND BI_Approval = 'approved' AND
//        CC_Approval <> 'declined' AND HR_Approval <> 'declined'`,
//       [user.id],
//     );

//     return Response.json({
//       pending: pending[0].count,
//       declined: declined[0].count,
//       approved: approved[0].count,
//     });
//   } catch (error) {
//     console.error("Database Error:", error);
//     return Response.json(
//       { error: "Failed to fetch approval counts" },
//       { status: 500 },
//     );
//   } finally {
//     if (connection) connection.release();
//   }
// }

//NEW REUSABLE APPROVAL COUNTS QUERY FOR ALL ROLES (staff, hr, cc, bi)
import pool from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";

const ROLE_QUERY_CONFIGS = {
  bi: {
    approvalField: "BI_APPROVAL",
    approverIdField: "bi_approver_id",
  },
  cc: {
    approvalField: "CC_APPROVAL",
    approverIdField: "cc_approver_id",
  },
  hr: {
    approvalField: "HR_APPROVAL",
    approverIdField: "hr_approver_id",
  },

  // Staff functions - they see the approval status of their submitted requests
  staff: {
    getPendingQuery: (userId) => ({
      sql: `SELECT COUNT(*) as count FROM purchasesInfo 
            WHERE user_id = ? 
            AND BI_Approval = 'pending' 
            AND CC_Approval <> 'declined' 
            AND HR_Approval <> 'declined'`,
      params: [userId],
    }),
    getDeclinedQuery: (userId) => ({
      sql: `SELECT COUNT(*) as count FROM purchasesInfo 
            WHERE user_id = ? AND (
            BI_Approval = 'declined' OR 
            HR_Approval = 'declined' OR 
            CC_Approval = 'declined')`,
      params: [userId],
    }),
    getApprovedQuery: (userId) => ({
      sql: `SELECT COUNT(*) as count FROM purchasesInfo 
            WHERE user_id = ? 
            AND BI_Approval = 'approved' 
            AND CC_Approval <> 'declined' 
            AND HR_Approval <> 'declined'`,
      params: [userId],
    }),
  },
};

//Generate SQL query configs for approver roles
function getApproverQueryConfigs(approvalField, approverIdField, userId) {
  return {
    pending: {
      sql: `SELECT COUNT(*) as count FROM purchasesInfo 
            WHERE ${approvalField} = 'pending'`,
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

    //Pending results
    const [pendingResult] = await connection.execute(
      queryConfigs.pending.sql,
      queryConfigs.pending.params,
    );

    //Declined results
    const [declinedResult] = await connection.execute(
      queryConfigs.declined.sql,
      queryConfigs.declined.params,
    );

    //Approved results
    const [approvedResult] = await connection.execute(
      queryConfigs.approved.sql,
      queryConfigs.approved.params,
    );

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
