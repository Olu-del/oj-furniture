// ===============================
// BASE EMAIL TEMPLATE
// ===============================
function baseTemplate(content) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />

    <style>
      body {
        margin: 0;
        padding: 0;
        background: #f4f4f4;
        font-family: Arial, sans-serif;
      }

      .container {
        width: 600px;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
      }

      .header {
        background: #2c3e50;
        padding: 25px;
        color: #ffffff;
        text-align: center;
      }

      .body {
        padding: 30px;
      }

      .footer {
        background: #ecf0f1;
        padding: 15px;
        font-size: 12px;
        text-align: center;
      }

      .order-table {
        width: 100%;
        border-collapse: collapse;
      }

      .order-table th {
        background: #f4f4f4;
        padding: 10px;
        text-align: left;
      }

      .order-table td {
        padding: 10px;
        border-bottom: 1px solid #eee;
        vertical-align: top;
      }

      .product-img {
        width: 80px;
        border-radius: 6px;
        margin-bottom: 8px;
        display: block;
      }

      .delivery-box {
        background: #f9fafc;
        border-left: 4px solid #2c3e50;
        padding: 15px;
        margin-top: 20px;
        border-radius: 4px;
      }

      .track-btn {
        display: inline-block;
        padding: 12px 20px;
        background: #2c3e50;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin-top: 20px;
      }

      .signin-link {
        font-size: 14px;
        color: #555;
        margin-top: 20px;
      }

      .signin-link a {
        color: #2c3e50;
        font-weight: bold;
        text-decoration: none;
      }

      @media only screen and (max-width: 600px) {
        .container {
          width: 100% !important;
        }
        .product-img {
          width: 60px;
        }
      }
    </style>

  </head>
  <body>

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
      <tr>
        <td align="center">

          <table class="container" cellpadding="0" cellspacing="0">

            <tr>
              <td class="header">
                <h1 style="margin:0; font-size:32px; font-weight:900; letter-spacing:1px;">
                  OJ FURNITURE
                </h1>
                <p style="margin:5px 0 0; font-size:14px; font-weight:600;">
                  Premium Used Furniture
                </p>
              </td>
            </tr>

            <tr>
              <td class="body">
                ${content}

                <!-- UNIVERSAL SIGN-IN LINK -->
                <p class="signin-link">
                  Not signed in?
                  <a href="${process.env.FRONTEND_URL}/signin">Click here to sign in</a>
                </p>
              </td>
            </tr>

            <tr>
              <td class="footer">
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



// ===============================
// REGISTRATION EMAIL
// ===============================
function registrationTemplate(firstName) {
  return baseTemplate(`
    <h2>Welcome ${firstName} 🎉</h2>
    <p>Thank you for registering with <strong>OJ Furniture</strong>.</p>
    <p>You can now browse and order quality used furniture.</p>

    <br/>

    <a href="${process.env.FRONTEND_URL}"
      style="display:inline-block; padding:12px 20px; background:#2c3e50; color:#ffffff; text-decoration:none; border-radius:4px;">
      Visit Our Store
    </a>
  `);
}



// ===============================
// CONTACT RESPONSE EMAIL
// ===============================
function contactTemplate(name) {
  return baseTemplate(`
    <h2>Hello ${name},</h2>
    <p>We have received your message.</p>
    <p>Our team will respond shortly.</p>
    <br/>
    <p>Thank you for contacting OJ Furniture.</p>
  `);
}



// ===============================
// ORDER CONFIRMATION EMAIL
// ===============================
function orderTemplate(firstName, order) {

  const itemsHtml = order.orderItems.map(item => `
    <tr>
      <td>
        ${item.imageUrl ? `
          <img 
           src="${item.imageUrl}"
            alt="${item.name} image"
            class="product-img"
          />
        ` : ""}
        <strong>${item.name}</strong>
      </td>

      <td align="center">${item.quantity}</td>
      <td align="right">£${Number(item.price).toFixed(2)}</td>
      <td align="right">£${Number(item.deliveryPrice || 0).toFixed(2)}</td>
    </tr>
  `).join("");

  return baseTemplate(`
    <h2>Order Confirmation 🛒</h2>
    <p>Hi ${firstName},</p>
    <p>Your order has been successfully placed.</p>

    <table class="order-table">
      <tr>
        <th>Product</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Delivery</th>
      </tr>
      ${itemsHtml}
    </table>

    <p><strong>Subtotal:</strong> £${Number(order.subtotal).toFixed(2)}</p>
    <p><strong>Delivery:</strong> £${Number(order.deliveryTotal).toFixed(2)}</p>
    <h3><strong>Total:</strong> £${Number(order.total).toFixed(2)}</h3>

    <div class="delivery-box">
      <p><strong>Delivery Slot:</strong> ${order.deliverySlot || "Not selected"}</p>
      <p><strong>Delivery Date:</strong> ${
        order.deliveryDate
          ? new Date(order.deliveryDate).toLocaleDateString("en-GB", {
              weekday: "long", day: "numeric", month: "long", year: "numeric"
            })
          : "Not selected"
      }</p>
    </div>

    <a href="${process.env.FRONTEND_URL}/orders/${order.id}" class="track-btn">
      Track My Order
    </a>
  `);
}



// ===============================
// ORDER OUT FOR DELIVERY EMAIL
// ===============================
function orderOutForDeliveryTemplate(firstName, order) {
  return baseTemplate(`
    <h2>Your Order is Out for Delivery</h2>

    <p>Hi ${firstName},</p>
    <p>Your order <strong>number: ${order.id}</strong> is now on its way.</p>

    <div class="delivery-box">
      <p><strong>Delivery Slot:</strong> ${order.deliverySlot}</p>
      <p><strong>Delivery Date:</strong> ${
        order.deliveryDate
          ? new Date(order.deliveryDate).toLocaleDateString("en-GB", {
              weekday: "long", day: "numeric", month: "long", year: "numeric"
            })
          : "Not selected"
      }</p>
    </div>

    <a href="${process.env.FRONTEND_URL}/orders/${order.id}" class="track-btn">
      Track My Order
    </a>
  `);
}



// ===============================
// ORDER DELIVERED EMAIL
// ===============================
function orderDeliveredTemplate(firstName, order) {
  return baseTemplate(`
    <h2>Your Order Has Been Delivered</h2>

    <p>Hi ${firstName},</p>
    <p>Your order <strong>number: ${order.id}</strong> has now been delivered.</p>

    <div class="delivery-box">
      <p><strong>Delivered On:</strong> ${
        order.deliveryDate
          ? new Date(order.deliveryDate).toLocaleDateString("en-GB", {
              weekday: "long", day: "numeric", month: "long", year: "numeric"
            })
          : "Today"
      }</p>
    </div>

    <p>We hope you enjoy your purchase.</p>

    <h3>Need help?</h3>
    <p>You can report an issue or request a return within 14 days.</p>

    <a href="${process.env.FRONTEND_URL}/complaint?orderId=${order.id}" class="track-btn">
      Report an Issue
    </a>
  `);
}



// ===============================
// COMPLAINT RECEIVED EMAIL
// ===============================
function complaintReceivedTemplate(firstName, orderId) {
  return baseTemplate(`
    <h2>Complaint Received</h2>

    <p>Hi ${firstName},</p>
    <p>We have received your complaint regarding order <strong>${orderId}</strong>.</p>

    <div class="delivery-box">
      <p><strong>Status:</strong> OPEN</p>
      <p><strong>Response Time:</strong> Within 24–48 hours</p>
    </div>

    <br/>

    <p>Thank you for your patience.</p>
  `);
}



// ===============================
// COMPLAINT STATUS UPDATE EMAIL
// ===============================
function complaintStatusTemplate(firstName, complaint) {
  let title = "";
  let message = "";

  switch (complaint.status) {
    case "IN_REVIEW":
      title = "Your Complaint is Being Reviewed";
      message = `
        <p>Hi ${firstName},</p>
        <p>Your complaint regarding order <strong>${complaint.orderId}</strong> is now being reviewed.</p>
      `;
      break;

    case "RESOLVED":
      title = "Your Complaint Has Been Resolved";
      message = `
        <p>Hi ${firstName},</p>
        <p>Your complaint for order <strong>${complaint.orderId}</strong> has now been resolved.</p>
      `;
      break;

    case "REJECTED":
      title = "Your Complaint Has Been Rejected";
      message = `
        <p>Hi ${firstName},</p>
        <p>Your complaint for order <strong>${complaint.orderId}</strong> has been rejected.</p>
      `;
      break;

    default:
      title = "Complaint Update";
      message = `
        <p>Hi ${firstName},</p>
        <p>There has been an update to your complaint for order <strong>${complaint.orderId}</strong>.</p>
      `;
  }

  return baseTemplate(`
    <h2>${title}</h2>
    ${message}

    <div class="delivery-box">
      <p><strong>Current Status:</strong> ${complaint.status}</p>
      <p><strong>Submitted:</strong> ${new Date(complaint.createdAt).toLocaleDateString()}</p>
    </div>

    <br/>

    <p>Thank you for your patience.</p>
  `);
}



// ===============================
// SURVEY EMAIL
// ===============================
function surveyEmailTemplate(firstName, orderId) {
  return baseTemplate(`
    <h2>Thank you for your order, ${firstName}!</h2>

    <p>Your order has now been delivered.</p>
    <p>We would love to hear your feedback about your experience.</p>

    <a href="${process.env.FRONTEND_URL}/survey/${orderId}"
      style="display:inline-block; padding:12px 20px; background:#4CAF50; color:#ffffff; text-decoration:none; border-radius:4px; margin-top:10px;">
      Take Survey
    </a>

    <br/><br/>

    <p>Thank you for helping us improve OJ Furniture.</p>
  `);
}



// ===============================
// EXPORT
// ===============================
module.exports = {
  baseTemplate,
  registrationTemplate,
  contactTemplate,
  orderTemplate,
  orderOutForDeliveryTemplate,
  orderDeliveredTemplate,
  complaintReceivedTemplate,
  complaintStatusTemplate,
  surveyEmailTemplate
};
