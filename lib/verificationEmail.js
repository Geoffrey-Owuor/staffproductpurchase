import nodemailer from "nodemailer";

// lib/email.js - Add this function
export async function sendVerificationEmail(to, verificationCode) {
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

  try {
    await transporter.sendMail({
      from: `"Staffpurchase Portal" <${process.env.GMAIL_USER}>`,
      to,
      subject: "Email Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
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
              .code {
                font-size: 24px;
                font-weight: bold;
                letter-spacing: 2px;
                color: #B71C1C;
                margin: 20px 0;
                padding: 10px 20px;
                background: #f5f5f5;
                display: inline-block;
                border-radius: 4px;
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
              <h2>Email Verification</h2>
              <p>Please use the following verification code to complete your registration:</p>
              
              <div class="code">${verificationCode}</div>
              
              <p class="note">This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
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
    throw new Error("Failed to send verification email.");
  }
}
