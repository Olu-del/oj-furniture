// email HTML templates used across the app
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

// ---------------- REGISTRATION EMAIL ----------------
// shows a welcome message and a link to the store
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


// ---------------- CONTACT RESPONSE EMAIL ----------------
// sends a confirmation that the user's message was received
function contactTemplate(name) {
  return `
    <h2>Hello ${name},</h2>
    <p>We have received your message.</p>
    <p>Our team will respond shortly.</p>
    <br/>
    <p>Thank you for contacting OJ Furniture.</p>
  `;
}


// ---------------- ORDER CONFIRMATION EMAIL ----------------
// shows order details including items, quantities, prices, and totals
function orderTemplate(firstName, order) {

  const itemsHtml = order.orderItems.map(item => `
    <tr style="border-bottom:1px solid #eee;">
      
      <td style="padding:10px;">
        ${item.imageUrl ? `
        <img 
          src="http://localhost:5000${item.imageUrl}" 
          alt="${item.name}" 
          width="80"
          style="border-radius:6px; display:block; margin-bottom:8px;"
        />
        ` : ""}
        <strong>${item.name}</strong>
      </td>

      <td style="padding:10px; text-align:center;">
        ${item.quantity}
      </td>

      <td style="padding:10px; text-align:right;">
        £${Number(item.price).toFixed(2)}
      </td>

      <td style="padding:10px; text-align:right;">
        £${Number(item.deliveryPrice || 0).toFixed(2)}
      </td>

    </tr>
  `).join("");

  return baseTemplate(`
    <h2>Order Confirmation 🛒</h2>
    <p>Hi ${firstName},</p>
    <p>Your order has been successfully placed.</p>

    <table width="100%" cellpadding="0" cellspacing="0" 
      style="border-collapse:collapse; width:100%;">

      <tr style="background:#f4f4f4;">
        <th align="left" style="padding:10px;">Product</th>
        <th align="center" style="padding:10px;">Qty</th>
        <th align="right" style="padding:10px;">Price</th>
        <th align="right" style="padding:10px;">Delivery</th>
      </tr>

      ${itemsHtml}

    </table>

    <br/>

    <p><strong>Subtotal:</strong> £${Number(order.subtotal || 0).toFixed(2)}</p>
    <p><strong>Delivery:</strong> £${Number(order.deliveryTotal || 0).toFixed(2)}</p>
    <h3><strong>Total:</strong> £${Number(order.total).toFixed(2)}</h3>
  `);
}


// ---------------- EXPORT TEMPLATES ----------------
module.exports = {
  baseTemplate,
  registrationTemplate,
  contactTemplate,
  orderTemplate
};
