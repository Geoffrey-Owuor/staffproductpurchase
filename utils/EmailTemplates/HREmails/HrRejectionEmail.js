const generateHrRejectionEmailHTML = ({
  staffName,
  payrollNo,
  hr_approver_name,
  hr_comments,
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
        <title>Purchase Request Rejected</title>
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
                      <h1 style="color: #B71C1C; font-size: 24px; text-align: center; margin: 0 0 15px 0;">Purchase Request Declined by HR</h1>
                      <p style="background: #ffebee; color: #B71C1C; text-align: center; padding: 10px; font-weight: bold; border-radius: 4px;">Status: HR Declined</p>
                      <p style="color: #555555; font-size: 15px;">We regret to inform you that your purchase request has been <strong>declined</strong> by HR.</p>
                      <h3 style="color: #333;">Details</h3>
                         <p><strong>Name:</strong> ${staffName}</p>
                         <p><strong>Payroll No:</strong> ${payrollNo}</p>
                         <p><strong>HR Approver:</strong> ${hr_approver_name}</p>
                         <p><strong>HR Comments:</strong> ${hr_comments}</p>
                         
                         <h3 style="color: #333;">Requested Items</h3>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: #f9f9f9; border: 1px solid #eeeeee; border-radius: 4px; margin: 20px 0; padding-bottom:12px;">
                         <thead>
                            <tr>
                              <th style="padding: 8px; border-bottom: 2px solid #333; text-align: left;">Item Name</th>
                              <th style="padding: 8px; border-bottom: 2px solid #333; text-align: left;">Product Code</th>
                              <th style="padding: 8px; border-bottom: 2px solid #333; text-align: left;">Final Price</th>
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
                      
                      <p style="color: #555555; font-size: 15px;">Please contact HR if you have any questions or wish to discuss this decision.</p>
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

export default generateHrRejectionEmailHTML;
