import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email, token) {
  try {
    await resend.emails.send({
      from: "geoffreyowuor22@gmail.com",
      to: email,
      subject: "Reset Your Password - Action Required",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    padding: 20px 0;
                    border-bottom: 1px solid #eaeaea;
                    margin-bottom: 30px;
                }
                .logo {
                    max-width: 150px;
                }
                .content {
                    background-color: #f9f9f9;
                    padding: 25px;
                    border-radius: 8px;
                    margin-bottom: 25px;
                }
                .button {
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #2563eb;
                    color: white !important;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: 600;
                    margin: 15px 0;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    padding-top: 20px;
                    border-top: 1px solid #eaeaea;
                }
                .expiry-note {
                    color: #dc2626;
                    font-weight: 600;
                }
                .support {
                    margin-top: 20px;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <!-- Replace with your actual logo URL -->
                <img src="https://tinyurl.com/4ac5puxp" alt="Company Logo" class="logo">
            </div>
            
            <div class="content">
                <h2>Password Reset Request</h2>
                <p>We received a request to reset your password. Click the button below to proceed:</p>
                
                <a href="${process.env.NEXTAUTH_URL}/reset-password?token=${token}" class="button">
                    Reset Password
                </a>
                
                <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
                
                <p class="expiry-note">⚠️ This link will expire in 1 hour for security reasons.</p>
            </div>
            
            <div class="support">
                <p>Need help? Contact our support team at <a href="mailto:support@yourdomain.com">support@yourdomain.com</a></p>
            </div>
            
            <div class="footer">
                <p>© ${new Date().getFullYear()} Hotpoint Appliances Ltd. All rights reserved.</p>
                <p>4333-4000, Nairobi, Kenya</p>
            </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Email Send Error:", error);
  }
}
