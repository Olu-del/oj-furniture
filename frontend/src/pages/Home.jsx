import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Home() {
  const [subCategoryCards, setSubCategoryCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const categoryRes = await api.get("/category");
        const categories = categoryRes.data;

        const cards = [];

        for (const category of categories) {
          for (const sub of category.subCategories) {
            const productRes = await api.get(
              `/product?subCategoryId=${sub.id}`
            );

            const firstProduct = productRes.data[0]; // pick first product

            cards.push({
              id: sub.id,
              name: sub.name,
              imageUrl: firstProduct?.imageUrl || null
            });
          }
        }

        setSubCategoryCards(cards);
      } catch (err) {
        console.error(err);
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
                src={`http://localhost:5000${card.imageUrl}`}
                alt={card.name}
                className="product-image"
                style={{ cursor: "pointer" }}
              />
            )}
            <h3>{card.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}