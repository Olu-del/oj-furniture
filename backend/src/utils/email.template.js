function baseTemplate(content) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body style="margin:0; padding:0; background:#f4f4f4; font-family: Arial, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" 
            style="background:#ffffff; border-radius:8px; overflow:hidden;">

            <!-- Header -->
            <tr>
              <td align="center" 
                style="background:#2c3e50; padding:25px; color:#ffffff;">
                <h1 style="margin:0;">OJ Furniture</h1>
                <p style="margin:5px 0 0;">Premium Used Furniture</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;">
                ${content}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" 
                style="background:#ecf0f1; padding:15px; font-size:12px;">
                © ${new Date().getFullYear()} OJ Furniture. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
}

function registrationTemplate(firstName) {
  return `
    <h2>Welcome ${firstName} 🎉</h2>
    <p>Thank you for registering with <strong>OJ Furniture</strong>.</p>
    <p>You can now browse and order quality used furniture.</p>

    <br/>

    <a href="http://localhost:3000"
      style="display:inline-block;
      padding:12px 20px;
      background:#2c3e50;
      color:#ffffff;
      text-decoration:none;
      border-radius:4px;">
      Visit Our Store
    </a>
  `;
}

function contactTemplate(name) {
  return `
    <h2>Hello ${name},</h2>
    <p>We have received your message.</p>
    <p>Our team will respond shortly.</p>
    <br/>
    <p>Thank you for contacting OJ Furniture.</p>
  `;
}

function orderTemplate(firstName, orderId, total) {
  return `
    <h2>Order Confirmation 🛒</h2>
    <p>Hi ${firstName},</p>
    <p>Your order has been successfully placed.</p>

    <table width="100%" cellpadding="10" 
      style="border-collapse: collapse; margin-top:20px;">
      <tr style="background:#f4f4f4;">
        <td><strong>Order ID</strong></td>
        <td>${orderId}</td>
      </tr>
      <tr>
        <td><strong>Total</strong></td>
        <td>₦${total}</td>
      </tr>
    </table>

    <br/>
    <p>We appreciate your business.</p>
  `;
}

module.exports = {
  baseTemplate,
  registrationTemplate,
  contactTemplate,
  orderTemplate
};
