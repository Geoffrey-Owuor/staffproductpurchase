import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function NotificationEmail({
  staffname,
  payrollno,
  itemname,
  itemstatus,
  tdprice,
  discountedvalue,
  approvalLink,
  emailaddress,
}) {
  try {
    await resend.emails.send({
      from: "noreply@yourdomain.com",
      to: emailaddress,
      subject: "New Purchase Request Requires Approval",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New Purchase Request Submitted</h2>
          <p>A new purchase request requires your approval:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Staff Member</th>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${staffname}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Payroll Number</th>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${payrollno}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Item Name</th>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${itemname}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Item Status</th>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${itemstatus}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Original Price</th>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${tdprice}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Discounted Price</th>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${discountedvalue}</td>
            </tr>
          </table>
          
          <p>Please review and approve or decline this request using the link below:</p>
          <a href="${approvalLink}" 
             style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px;">
            Review Purchase Request
          </a>
          
          <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
            This is an automated message. Please do not reply directly to this email.
          </p>
        </div>
      `,
    });

    console.log("Notification email sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Error sending notification email:", error);
    return { success: false, error: error.message };
  }
}
