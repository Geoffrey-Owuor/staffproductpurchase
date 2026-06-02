//lib/emailSender.js
// -- OLD EMAIL SENDING METHOD - GOOGLE WITH NODEMAILER
// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASSWORD,
//   },
// });

// export async function sendEmail({ to, subject, html, attachments }) {
//   try {
//     const mailOptions = {
//       from: `"Staff Purchase Portal" <${process.env.GMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     };
//     if (attachments) {
//       mailOptions.attachments = attachments.map((attachment) => ({
//         filename: attachment.filename || document.pdf,
//         content: attachment.content,
//         contentType: "application/pdf",
//         disposition: "attachment",
//         // You can also use 'disposition: "attachment"' to ensure it's downloaded
//       }));
//     }

//     await transporter.sendMail(mailOptions);
//     return { success: true };
//   } catch (error) {
//     console.error("Email failed:", error.message);
//     return { success: false, error: error.message };
//   }
// }

// -- NEW EMAIL SENDING METHOD - MICROSOFT GRAPH API WITH AZURE MSL NODE PACKAGE

import { ConfidentialClientApplication } from "@azure/msal-node";

const msalConfig = {
  auth: {
    clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
    authority: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}`,
    clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

async function getAccessToken() {
  const result = await cca.acquireTokenByClientCredential({
    // Using Graph scope now
    scopes: ["https://graph.microsoft.com/.default"],
  });
  return result?.accessToken;
}

export const sendEmail = async ({ to, cc, subject, html, attachments }) => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) throw new Error("Failed to retrieve access token");

    // Format recipients for Graph API
    const toRecipients = (Array.isArray(to) ? to : [to]).map((email) => ({
      emailAddress: { address: email },
    }));

    const ccRecipients = cc
      ? (Array.isArray(cc) ? cc : [cc]).map((email) => ({
          emailAddress: { address: email },
        }))
      : [];

    // Format attachments for Graph API
    const formattedAttachments = attachments?.map((file) => ({
      "@odata.type": "#microsoft.graph.fileAttachment",
      name: file.filename,
      // Graph requires content to be a Base64 string
      contentBytes: file.content, //Already converted to base64 string in generate purchasePdf
    }));

    // Construct the Graph Message object
    const emailPayload = {
      message: {
        subject: subject,
        body: {
          contentType: "HTML",
          content: html,
        },
        toRecipients: toRecipients,
        ccRecipients: ccRecipients,
        attachments: formattedAttachments || [],
      },
      saveToSentItems: "true",
    };

    // --- NEW RETRY LOGIC FOR CONCURRENCY & RATE LIMITS ---
    let attempts = 0;
    const maxRetries = 3;

    while (attempts < maxRetries) {
      attempts++;

      const response = await fetch(
        `https://graph.microsoft.com/v1.0/users/${process.env.EMAIL_SENDER}/sendMail`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailPayload),
        },
      );

      if (response.ok) {
        return { success: true };
      }

      // Handle 429 Too Many Requests (Concurrency / Rate Limiting)
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");

        // Use Microsoft's requested wait time, or fallback to an escalating delay (e.g., 2s, 4s, 6s)
        const waitTime = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : 2000 * attempts;

        console.warn(
          `Graph API limit hit (429). Retrying in ${waitTime / 1000}s... (Attempt ${attempts} of ${maxRetries})`,
        );

        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue; // Restart the loop for the next attempt
      }

      // If it's a different error (like 400 Bad Request), fail immediately
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
          `Failed to send email via Graph (Status: ${response.status})`,
      );
    }

    // If the loop finishes without returning success, we exhausted our retries
    throw new Error(
      "Max retries reached. Failed to send email due to persistent throttling.",
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Graph Email failed:", errorMessage);
    return { success: false, error: errorMessage };
  }
};
