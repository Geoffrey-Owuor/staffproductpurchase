import { sendEmail } from "../emailSender";
import { CachedEmails } from "@/utils/Cache/CachedConditions";
import generatePurchaseEmailHTML from "@/utils/EmailTemplates/StaffEmails/SendtoPayrollEmail";
import generateUserPurchaseEmailHTML from "@/utils/EmailTemplates/StaffEmails/SendtoStaffEmail";
import generateCCDirectEmailHTML from "@/utils/EmailTemplates/CCDirectEmail/CCDirectEmail";

/**
 * Handles sending purchase notifications in the background.
 * This function is designed to be "fired and forgotten" and
 * must handle its own errors.
 */

export async function userEmailHandler(payload) {
  const { staffInfo, products, paymentInfo, user, referenceNumber } = payload;

  try {
    // 1. Generate all email templates
    // (It's good practice to pass referenceNumber to your templates)
    const emailHtml = generatePurchaseEmailHTML({
      staffInfo: staffInfo,
      products: products,
    });

    const userEmailHtml = generateUserPurchaseEmailHTML({
      staffInfo: staffInfo,
      products: products,
    });

    const ccEmailHtml = generateCCDirectEmailHTML({
      staffInfo: staffInfo,
      products: products,
    });

    //Getting approver emails required
    const emails = await CachedEmails();
    const payrollEmail = emails[0].approver_email;
    const ccEmail = emails[2].approver_email;

    // Email sending promises array
    const emailPromises = [];
    const subjectPrefix = `Purchase Request ${referenceNumber}`;
    const approvalPrefix = "Requires Approval - Staff Name:";

    //IF STATEMENT which checks payment terms type to send an appropriate email (To credit control or to HR)
    if (paymentInfo.employee_payment_terms === "CASH") {
      emailPromises.push(
        sendEmail({
          to: ccEmail,
          subject: `${subjectPrefix} ${approvalPrefix} ${staffInfo.staffName}`,
          html: ccEmailHtml,
        }),
      );
    } else {
      emailPromises.push(
        sendEmail({
          to: payrollEmail,
          subject: `${subjectPrefix} ${approvalPrefix} ${staffInfo.staffName}`,
          html: emailHtml,
        }),
      );
    }
    //Send email to the user
    emailPromises.push(
      sendEmail({
        to: user.email,
        subject: `${subjectPrefix} Submitted Successfully`,
        html: userEmailHtml,
      }),
    );

    //Send the emails
    await Promise.all(emailPromises);
  } catch (error) {
    console.error(
      `CRITICAL_EMAIL_FAILURE: Failed to send notifications for ${referenceNumber}. Error: ${error.message}`,
    );
  }
}
