const calculateDaysDifference = (startDate, endDate) => {
  if (!startDate || !endDate) return "N/A";

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
};

const biApprovalDate = new Date().toLocaleDateString("en-GB");

const generateStaffBIApprovedEmailHTML = ({
  staffName,
  payrollNo,
  createdAt,
  bi_approver_name,
  products,
}) => {
  const itemsHtml = products
    .map(
      (p) =>
        `
     <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${p.itemName}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${p.productCode || "n/a"}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${p.discountedValue}</td>
    </tr>
    `,
    )
    .join("");

  const totalValue = products
    .reduce((sum, p) => sum + parseFloat(p.discountedValue || 0), 0)
    .toFixed(2);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Purchase Request Approved</title>
        <!--[if mso]>
          <style>
            .detail-row td { padding: 8px 0; }
          </style>
        <![endif]-->
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color:#ffffff;">
        <center>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <img src="https://hotpoint.co.ke/media/images/Hotpoint_Appliances_Ltd.width-800.png" alt="Hotpoint Appliances" width="180" style="display: block;">
              </td>
            </tr>
            <tr>
              <td>
                <table width="100%" cellpadding="0" cellspacing="0" style="background: #fcfcfc; border-top: 5px solid #B71C1C; border-radius: 8px; max-width: 600px; margin: 0 auto;">
                  <tr>
                    <td style="padding: 25px;">
                      <h1 style="color: #4CAF50; font-size: 24px; text-align: center; margin: 0 0 15px 0;">Purchase Request Approved by Billing & Invoice</h1>
                       <p style="background: #E8F5E9; color: #4CAF50; text-align: center; padding: 10px; font-weight: bold; border-radius: 4px;">Status: Billing & Invoice Approved</p>
                       <p style="color: #555555; font-size: 15px;">We are pleased to inform you that your purchase request has been <strong>fully approved</strong></p>
                      <h3 style="color: #333;">Details</h3>
                         <p><strong>Name:</strong> ${staffName}</p>
                         <p><strong>Payroll No:</strong> ${payrollNo}</p>
                         <p><strong>Billing & Invoice Approver:</strong> ${bi_approver_name}</p>
                         <p><strong>Billing & Invoice Approval Date:</strong> ${biApprovalDate}</p>
                         <p><strong>Approval Time:</strong> ${calculateDaysDifference(createdAt, new Date())}</p>
                         
                         <h3 style="color: #333;">Requested Items</h3>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: #f9f9f9; border: 1px solid #eeeeee; border-radius: 4px; margin: 20px 0; padding-bottom:12px;">
                         <thead>
                            <tr>
                              <th style="padding: 8px; border-bottom: 2px solid #333; text-align: left;">Item Name</th>
                              <th style="padding: 8px; border-bottom: 2px solid #333; text-align: left;">Product Code</th>
                              <th style="padding: 8px; border-bottom: 2px solid #333; text-align: left;">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${itemsHtml}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
                              <td style="padding: 8px; font-weight: bold;">${totalValue}</td>
                            </tr>
                          </tfoot>
                        
                      </table>
                      
                      <p style="color: #555555; font-size: 15px;">You can log in to the Staff Purchase Portal to view more details</p>
                       <div style="text-align: center; margin-top: 20px;">
                        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/login" style="display:inline-block; background-color: #B71C1C; color: white !important; padding: 12px 24px; text-decoration: none !important; border-radius: 15px; font-weight: bold;">Portal Login</a>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px 0; color: #888888; font-size: 13px;">
                <p>© ${new Date().getFullYear()} Hotpoint Appliances Ltd. All rights reserved.</p>
                <p>402, 00606 - Sukari Industrial Estate, Ruiru, Kenya</p>
              </td>
            </tr>
          </table>
        </center>
      </body>
    </html>
  `;
};

export default generateStaffBIApprovedEmailHTML;
