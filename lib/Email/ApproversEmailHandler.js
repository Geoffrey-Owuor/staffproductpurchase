import { sendEmail } from "../emailSender";
import { CachedEmails } from "@/utils/Cache/CachedConditions";
import { generatePurchasePDF } from "@/utils/returnPurchasePDF";

//All the email templates
import generatePayrollApprovalEmailHTML from "@/utils/EmailTemplates/PayrollEmails/PayrollApprovalEmail";
import generatePayrollRejectionEmailHTML from "@/utils/EmailTemplates/PayrollEmails/PayrollRejectionEmail";
import generateStaffPayrollApprovedEmailHTML from "@/utils/EmailTemplates/PayrollEmails/StaffPayrollApprovedEmail";
import generateHrApprovalEmailHTML from "@/utils/EmailTemplates/HREmails/HrApprovalEmail";
import generateHrRejectionEmailHTML from "@/utils/EmailTemplates/HREmails/HrRejectionEmail";
import generateStaffHrApprovedEmailHTML from "@/utils/EmailTemplates/HREmails/StaffHrApprovedEmail";
import generateCCApprovalEmailHTML from "@/utils/EmailTemplates/CCEmails/CCApprovalEmail";
import generateCCRejectionEmailHTML from "@/utils/EmailTemplates/CCEmails/CCRejectionEmail";
import generateStaffCCApprovedEmailHTML from "@/utils/EmailTemplates/CCEmails/StaffCCApprovedEmail";
import generateStaffBIApprovedEmailHTML from "@/utils/EmailTemplates/BIEmails/BIApprovalEmail";
import generateBIRejectionEmailHTML from "@/utils/EmailTemplates/BIEmails/BIRejectionEmail";
import generateBICCApprovedEmailHTML from "@/utils/EmailTemplates/BIEmails/BICCEmail";

/**
 * Handles sending approval/rejection notifications in the background.
 * This function is "fire-and-forget" and handles all its own errors.
 *
 **/

export async function ApproversEmailHandler(payload) {
  const { user, newData, oldData } = payload;

  const { products, ...purchaseData } = newData;

  try {
    // Getting required approver emails
    const emails = await CachedEmails();
    const hrEmail = emails[1].approver_email;
    const ccEmail = emails[2].approver_email;
    const biEmail = emails[3].approver_email;

    const emailPromises = [];

    // Payroll Approval and decline Emails
    if (
      user.role === "payroll" &&
      newData.Payroll_Approval &&
      newData.Payroll_Approval !== oldData.Payroll_Approval
    ) {
      if (newData.Payroll_Approval === "approved") {
        emailPromises.push(
          sendEmail({
            to: hrEmail,
            subject: `Purchase Request ${oldData.reference_number} Requires Approval - Staff Name: ${newData.staffName}`,
            html: generatePayrollApprovalEmailHTML({
              staffName: newData.staffName,
              payrollNo: newData.payrollNo,
              payroll_approver_name: newData.payroll_approver_name,
              products: products,
            }),
          }),
        );
        emailPromises.push(
          sendEmail({
            to: oldData.user_email,
            subject: `Purchase Request ${oldData.reference_number} Approved by Payroll - Staff Name: ${newData.staffName}`,
            html: generateStaffPayrollApprovedEmailHTML({
              staffName: newData.staffName,
              payrollNo: newData.payrollNo,
              payroll_approver_name: newData.payroll_approver_name,
              products: products,
            }),
          }),
        );
      } else if (newData.Payroll_Approval === "declined") {
        emailPromises.push(
          sendEmail({
            to: oldData.user_email,
            subject: `Purchase Request ${oldData.reference_number} Declined by Payroll - Staff Name: ${newData.staffName}`,
            html: generatePayrollRejectionEmailHTML({
              staffName: newData.staffName,
              payrollNo: newData.payrollNo,
              payroll_approver_name: newData.payroll_approver_name,
              one_third_rule: newData.one_third_rule,
              products: products,
            }),
          }),
        );
      }
    }

    // Hr Approval And Decline Emails
    if (
      user.role === "hr" &&
      newData.HR_Approval &&
      newData.HR_Approval !== oldData.HR_Approval
    ) {
      if (newData.HR_Approval === "approved") {
        emailPromises.push(
          sendEmail({
            to: ccEmail,
            subject: `Purchase Request ${oldData.reference_number} Requires Approval - Staff Name: ${newData.staffName}`,
            html: generateHrApprovalEmailHTML({
              staffName: newData.staffName,
              payrollNo: newData.payrollNo,
              hr_approver_name: newData.hr_approver_name,
              products: products,
            }),
          }),
        );
        emailPromises.push(
          sendEmail({
            to: oldData.user_email,
            subject: `Purchase Request ${oldData.reference_number} Approved by HR - Staff Name: ${newData.staffName}`,
            html: generateStaffHrApprovedEmailHTML({
              staffName: newData.staffName,
              payrollNo: newData.payrollNo,
              hr_approver_name: newData.hr_approver_name,
              products: products,
            }),
          }),
        );
      } else if (newData.HR_Approval === "declined") {
        emailPromises.push(
          sendEmail({
            to: oldData.user_email,
            subject: `Purchase Request ${oldData.reference_number} Declined by HR - Staff Name: ${newData.staffName}`,
            html: generateHrRejectionEmailHTML({
              staffName: newData.staffName,
              payrollNo: newData.payrollNo,
              hr_approver_name: newData.hr_approver_name,
              hr_comments: newData.hr_comments,
              products: products,
            }),
          }),
        );
      }
    }

    // Credit Control Approval and Decline Emails
    if (
      user.role === "cc" &&
      newData.CC_Approval &&
      newData.CC_Approval !== oldData.CC_Approval
    ) {
      if (newData.CC_Approval === "approved") {
        emailPromises.push(
          sendEmail({
            to: biEmail,
            subject: `Purchase Request ${oldData.reference_number} Requires Approval - Staff Name: ${newData.staffName}`,
            html: generateCCApprovalEmailHTML({
              staffName: newData.staffName,
              payrollNo: newData.payrollNo,
              cc_approver_name: newData.cc_approver_name,
              products: products,
            }),
          }),
        );

        emailPromises.push(
          sendEmail({
            to: oldData.user_email,
            subject: `Purchase Request ${oldData.reference_number} Approved by Credit Control - Staff Name: ${newData.staffName}`,
            html: generateStaffCCApprovedEmailHTML({
              staffName: newData.staffName,
              payrollNo: newData.payrollNo,
              cc_approver_name: newData.cc_approver_name,
              products: products,
            }),
          }),
        );
      } else if (newData.CC_Approval === "declined") {
        emailPromises.push(
          sendEmail({
            to: oldData.user_email,
            subject: `Purchase Request ${oldData.reference_number} Declined by Credit Control - Staff Name: ${newData.staffName}`,
            html: generateCCRejectionEmailHTML({
              staffName: newData.staffName,
              payrollNo: newData.payrollNo,
              cc_approver_name: newData.cc_approver_name,
              purchase_history_comments: newData.purchase_history_comments,
              products: products,
            }),
          }),
        );
      }
    }

    // Billing & Invoice Approval and Decline Emails
    if (
      user.role === "bi" &&
      newData.BI_Approval &&
      newData.BI_Approval !== oldData.BI_Approval
    ) {
      if (newData.BI_Approval === "approved") {
        // --- PDF Generation ---
        // This MUST be awaited *within* the handler,
        // but it won't block the main API response.
        const pdfAttachment = await generatePurchasePDF({
          purchaseData, // This is newData minus products
          products,
          createdAt: oldData.createdAt,
          reference: oldData.reference_number,
        });

        // This email sends the PDF, so it must wait for the PDF
        // We await it here so if it fails, the next email to CC doesn't send.
        await sendEmail({
          to: oldData.user_email,
          subject: `Purchase Request ${oldData.reference_number} Approved By Billing and Invoice - Staff Name: ${newData.staffName}`,
          html: generateStaffBIApprovedEmailHTML({
            staffName: newData.staffName,
            payrollNo: newData.payrollNo,
            createdAt: oldData.createdAt,
            bi_approver_name: newData.bi_approver_name,
            products: products,
          }),
          attachments: [pdfAttachment], // Attaching the generated PDF
        });

        // This email can now be sent.
        emailPromises.push(
          sendEmail({
            to: ccEmail,
            subject: `Close Purchase Request ${oldData.reference_number} for Staff: ${newData.staffName}`,
            html: generateBICCApprovedEmailHTML({
              staffName: newData.staffName,
              payrollNo: newData.payrollNo,
              createdAt: oldData.createdAt,
              bi_approver_name: newData.bi_approver_name,
              products: products,
            }),
          }),
        );
      } else if (newData.BI_Approval === "declined") {
        emailPromises.push(
          sendEmail({
            to: oldData.user_email,
            subject: `Purchase Request ${oldData.reference_number} Declined by Billing & Invoice - Staff Name: ${newData.staffName}`,
            html: generateBIRejectionEmailHTML({
              staffName: newData.staffName,
              payrollNo: newData.payrollNo,
              bi_approver_name: newData.bi_approver_name,
              purchase_history_comments: newData.purchase_history_comments,
              products: products,
            }),
          }),
        );
      }
    }

    // Commit all *other* email promises
    await Promise.all(emailPromises);
  } catch (error) {
    console.error(
      `CRITICAL_EMAIL_FAILURE: Failed to send notifications for ${oldData.reference_number}. Error: ${error.message}`,
    );
  }
}
