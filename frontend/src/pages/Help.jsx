// Help and support landing page
export default function Help() {
  return (
    <div className="page">
      <h2>Help & Support</h2>

      <p>
        We're here to make your shopping experience smooth and stress‑free.
        Choose a topic below to get quick help.
      </p>

      <div className="help-links">
        <a href="/help/faq" className="help-card">
          <h3>Frequently Asked Questions</h3>
          <p>Common questions about orders, delivery, returns and more.</p>
        </a>

        <a href="/about" className="help-card">
          <h3>About Us</h3>
          <p>Learn more about OJ Furniture and our mission.</p>
        </a>

        <a href="/contact" className="help-card">
          <h3>Contact Support</h3>
          <p>Need help? Get in touch with our support team.</p>
        </a>
      </div>
    </div>
  );
}
