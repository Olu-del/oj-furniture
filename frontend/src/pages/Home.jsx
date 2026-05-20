import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Home() {
  const [subCategoryCards, setSubCategoryCards] = useState([]);
  const navigate = useNavigate();

  // Build API base for images (remove /api)
  const API_BASE =
    process.env.REACT_APP_API_URL?.replace("/api", "") || "";

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const categoryRes = await api.get("/category");
        const categories = Array.isArray(categoryRes.data)
          ? categoryRes.data
          : [];

        const cards = [];

        for (const category of categories) {
          const safeSubs = Array.isArray(category.subCategories)
            ? category.subCategories
            : [];

          for (const sub of safeSubs) {
            const productRes = await api.get(
              `/product?subCategoryId=${sub.id}`
            );

            const products = Array.isArray(productRes.data)
              ? productRes.data
              : [];

            const firstProduct = products[0];

            cards.push({
              id: sub.id,
              name: sub.name,
              imageUrl: firstProduct?.imageUrl || null,
            });
          }
        }

        setSubCategoryCards(cards);
      } catch (err) {
        console.error("Failed to load home data:", err);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="page">
      <h2>Shop by Category</h2>

      <div className="product-list">
        {subCategoryCards.map((card) => (
          <div
            key={card.id}
            className="product-card"
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate(`/product?subCategoryId=${card.id}`)
            }
          >
            {card.imageUrl && (
              <img
                src={card.imageUrl}
                alt={card.name}
                className="product-image"
              />
            )}

            <h3>{card.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
