import nodemailer from "nodemailer";

export async function sendResetEmail(to, resetLink) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465, // SSL (alternatively, use 587 with `secure: false`)
    secure: true, // True for 465, false for 587
    auth: {
      user: process.env.GMAIL_USER, // Your full email (e.g., "user@gmail.com")
      pass: process.env.GMAIL_APP_PASSWORD, // 16-character app password
    },
  });

  try {
    await transporter.sendMail({
      from: `"Staffpurchase Portal" <${process.env.GMAIL_USER}>`, // Professional "From" name
      to,
      subject: "Password Reset Request",
      html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            background-color: #ffffff;
          }
          .header { 
            text-align: center; 
            padding: 20px 0 10px 0; 
          }
          .logo { 
            max-width: 180px; 
            height: auto;
          }
          .content { 
            padding: 20px; 
            text-align: center; 
            background-color: #ffffff; 
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }
          h2 {
            color: #B71C1C;
            margin-top: 0;
          }
          .button {
            display: inline-block; 
            padding: 12px 30px; 
            background-color: #B71C1C; 
            color: white !important; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
          }
          .button:hover {
            background-color: #D32F2F !important;
          }
          .footer { 
            margin-top: 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #777777; 
            padding-top: 20px;
          }
          .note {
            font-size: 14px;
            color: #666666;
            margin-top: 25px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://hotpoint.co.ke/media/images/Hotpoint_Appliances_Ltd.width-800.png" alt="Hotpoint Appliances" class="logo">
        </div>
        
        <div class="content">
          <h2>Forgot Your Password?</h2>
          <p>We received a request to reset your password. Click the button below to create a new one:</p>
          
          <a href="${resetLink}" class="button">Reset Password</a>
          
          <p class="note">If you didn't request this, please ignore this email.<br>The link will expire in 1 hour.</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Hotpoint Appliances Ltd. All rights reserved.</p>
          <p>402, 00606 - Sukari Industrial Estate, Ruiru, Kenya</p>
        </div>
      </body>
    </html>
  `,
    });
  } catch (error) {
    console.error("Email failed:", error.message);
    throw new Error("Failed to send email. Please try again later.");
  }
}
