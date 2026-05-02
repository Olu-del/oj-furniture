import { useEffect, useState } from "react";
import api from "../services/api";

// AdminSurveyPage – shows all customer feedback
export default function AdminSurveyPage() {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    api.get("/survey") // GET request to fetch all surveys
      .then((res) => setSurveys(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!surveys.length) {
    return (
      <div className="page">
        <h2>No feedback yet</h2>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Customer Feedback</h2>

      {surveys.map((s) => (
        <div key={s.id} className="order-card">

          {/* User info */}
          <p><strong>User:</strong> {s.user.email}</p>
          <p><strong>Order:</strong> #{s.order.id}</p>

          {/* Ratings */}
          <p>⭐ Rating: {s.rating} / 5</p>
          <p>🧭 Ease of Use: {s.ease} / 5</p>

          {/* Comments */}
          {s.comments && (
            <p>
              💬 <strong>Comment:</strong> {s.comments}
            </p>
          )}

          {/* Date */}
          <p style={{ fontSize: "12px", opacity: 0.6 }}>
            {new Date(s.createdAt).toLocaleString()}
          </p>

        </div>
      ))}
    </div>
  );
}