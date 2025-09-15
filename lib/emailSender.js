//lib/emailSender.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail({ to, subject, html, attachments }) {
  try {
    const mailOptions = {
      from: `"Staff Purchase Portal" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    };
    if (attachments) {
      mailOptions.attachments = attachments.map((attachment) => ({
        filename: attachment.filename || document.pdf,
        content: attachment.content,
        contentType: "application/pdf",
        disposition: "attachment",
        // You can also use 'disposition: "attachment"' to ensure it's downloaded
      }));
    }

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email failed:", error.message);
    return { success: false, error: error.message };
  }
}
