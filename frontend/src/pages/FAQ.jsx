 import { useState } from "react";

// Single FAQ item with toggleable answer visibility
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="faq-item">
      <h3 onClick={() => setOpen(!open)} className="faq-question">
        {question}
      </h3>
      {open && <p className="faq-answer">{answer}</p>}
    </div>
  );
}

// FAQ page containing expandable question items
export default function FAQ() {
  return (
    <div className="page">
      <h2>Frequently Asked Questions</h2>

      <FAQItem
        question="How do I place an order?"
        answer="Browse our products, add items to your basket, and complete checkout with your delivery details."
      />

      <FAQItem
        question="How long does delivery take?"
        answer="Delivery dates and time slots are shown at checkout. You’ll receive updates by email."
      />

      <FAQItem
        question="How do I report an issue with my order?"
        answer="Go to My Orders, select the order, and submit a complaint. You’ll receive email updates."
      />

      <FAQItem
        question="What payment methods do you accept?"
        answer="It is a school project, you don't have to worry about payment methods. Just click the checkout button and your order will be placed successfully."
      />

      <FAQItem
        question="Can I save my delivery address?"
        answer="Yes. You can save your delivery address during checkout for faster future orders."
      />
    </div>
  );
}
