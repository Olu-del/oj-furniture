import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

// SurveyPage – allows user to leave feedback for an order
export default function SurveyPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [ease, setEase] = useState(5);
  const [comments, setComments] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if survey already exists
  useEffect(() => {
  api.get(`/survey/${orderId}`)
    .then((res) => {
      if (res.data && res.data.id) {
        setSubmitted(true);
      }
    })
    .catch(() => {})
    .finally(() => setLoading(false));
}, [orderId]);
  // Handle submit
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/survey", {
      orderId: Number(orderId),
      rating,
      ease,
      comments
    });

    if (res.data && res.data.id) {
      setSubmitted(true);
    }

  } catch (err) {
    console.error("Failed to submit survey", err);
    alert(err.response?.data?.message || "Error submitting survey");
  }
};

  // Loading state
  if (loading) {
    return (
      <div className="page">
        <h2>Loading...</h2>
      </div>
    );
  }

  // Already submitted
  if (submitted) {
    return (
      <div className="page">
        <h2>Thank you for your feedback!</h2>
        <button className="btn" onClick={() => navigate("/orders")}>
          Back to Orders
        </button>
      </div>
    );
  }

  // Form UI
  return (
    <div className="page">
      <h2>Rate Your Experience</h2>

      <form onSubmit={handleSubmit} className="form">

        {/* Overall Rating */}
        <label>Overall Rating (1–5)</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>

        {/* Ease of Use */}
        <label>Ease of Use (1–5)</label>
        <select
          value={ease}
          onChange={(e) => setEase(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>

        {/* Comments */}
        <label>Comments (optional)</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Tell us about your experience..."
        />

        <button className="btn">Submit Survey</button>
      </form>
    </div>
  );
}