import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// Home component – displays “Shop by Category” cards for all subcategories
export default function Home() {
  
  // State to hold subcategory cards for the homepage
  const [subCategoryCards, setSubCategoryCards] = useState([]);
  const navigate = useNavigate();

  
  // Load data on component mount
  useEffect(() => {
    const loadHomeData = async () => {
      try {
        // Fetch all categories from backend
        const categoryRes = await api.get("/category");
        const categories = categoryRes.data;

        const cards = [];

        // Loop through each category and its subcategories
        for (const category of categories) {
          for (const sub of category.subCategories) {
            // Fetch products for each subcategory
            const productRes = await api.get(
              `/product?subCategoryId=${sub.id}`
            );

            // Pick the first product for thumbnail image
            const firstProduct = productRes.data[0];

            // Build card object with id, name, image
            cards.push({
              id: sub.id,
              name: sub.name,
              imageUrl: firstProduct?.imageUrl || null
            });
          }
        }

        // Update state to display on homepage
        setSubCategoryCards(cards);
      } catch (err) {
        console.error("Failed to load home data:", err);
      }
    };

    loadHomeData();
  }, []);

  
  // Render the homepage
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
              navigate(`/product?subCategoryId=${card.id}`) // navigate to product list of that subcategory
            }
          >
            {/* Display thumbnail image if available */}
            {card.imageUrl && (
              <img
                src={`${api.defaults.baseURL.replace("/api", "")}${card.imageUrl}`}
                alt={card.name}
                className="product-image"
                style={{ cursor: "pointer" }}
              />
            )}

            {/* Subcategory name */}
            <h3>{card.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}