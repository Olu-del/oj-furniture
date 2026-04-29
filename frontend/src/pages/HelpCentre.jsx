// Help Centre page with quick access cards for support topics
export default function HelpCentre() {
  return (
    <div className="page help-centre">
      <h2>Help Centre</h2>
      <p>Find answers, support and guidance for your OJ Furniture orders.</p>

      <div className="help-grid">

        <a href="/help/faq" className="help-centre-card">
          <h3>Ordering</h3>
          <p>How to place an order, payment options, and order updates.</p>
        </a>

        <a href="/help/faq" className="help-centre-card">
          <h3>Delivery</h3>
          <p>Delivery slots, tracking, and what to expect on delivery day.</p>
        </a>

        <a href="/help/faq" className="help-centre-card">
          <h3>Returns & Complaints</h3>
          <p>How to report an issue or request a return.</p>
        </a>

        <a href="/help/faq" className="help-centre-card">
          <h3>Payments</h3>
          <p>Accepted payment methods and receipts.</p>
        </a>

        <a href="/signin" className="help-centre-card">
          <h3>My Orders</h3>
          <p>View your order history and track your deliveries.</p>
        </a>

        <a href="/about" className="help-centre-card">
          <h3>About Us</h3>
          <p>Learn more about OJ Furniture and our mission.</p>
        </a>

      </div>
    </div>
  );
}
