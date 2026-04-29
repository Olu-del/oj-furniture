import { Link } from "react-router-dom";


export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* COLUMN 1 — SHOP */}
        <div className="footer-column">
          <h4>Shop</h4>
          <Link to="/product">Products</Link>
          <Link to="/cart">Basket</Link>
          <Link to="/signin">Order History</Link>
        </div>

        {/* COLUMN 2 — HELP */}
        <div className="footer-column">
          <h4>Help & Support</h4>
          <Link to="/help-centre">Help Centre</Link>
          <Link to="/help/faq">FAQ</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/help/faq">Returns & Complaints</Link>
          <Link to="/help/faq">Delivery Information</Link>
        </div>

        {/* COLUMN 3 — ABOUT */}
        <div className="footer-column">
          <h4>About</h4>
          <Link to="/about">About Us</Link>
          
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} OJ Furniture. All rights reserved.</p>
      </div>
    </footer>
  );
}
