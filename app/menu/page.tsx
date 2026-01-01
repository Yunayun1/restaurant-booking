// "use client";

// import React from "react";
// import { fakeFoods, Food } from "../data/foods";

// export default function MenuPage() {
//   return (
//     <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
//       <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>Menu</h1>

//       <div
//         style={{
//           display: "grid",
//           gap: "1.5rem",
//           gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
//         }}
//       >
//         {fakeFoods.map((food: Food) => (
//           <div
//             key={food.id}
//             style={{
//               border: "1px solid #ccc",
//               borderRadius: "12px",
//               overflow: "hidden",
//               boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//             }}
//           >
//             <img
//               src={food.image}
//               alt={food.name}
//               style={{ width: "100%", height: "160px", objectFit: "cover" }}
//             />
//             <div style={{ padding: "1rem" }}>
//               <h3 style={{ margin: "0 0 0.5rem 0", fontWeight: 600 }}>{food.name}</h3>
//               <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", color: "#555" }}>
//                 {food.description}
//               </p>
//               <p style={{ fontWeight: "bold", fontSize: "1rem" }}>${food.price}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import styles from "./menu.module.css";
import TopBar from "../landing/TopBar"; 

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  favorite: boolean;
  category: string;
  image: string;
}

export default function MenuPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleFavorite = (id: string) => {
    setMenus(prev =>
      prev.map(menu =>
        menu.id === id ? { ...menu, favorite: !menu.favorite } : menu
      )
    );
  };

  const renderStars = (rating: number) => {
    const filledStars = Math.round(rating);
    return (
      <div className={styles["star-container"]}>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            style={{ color: i < filledStars ? "#ffb400" : "#e0e0e0" }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  useEffect(() => {
    fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood")
      .then(res => res.json())
      .then(data => {
        const meals = data.meals.map((item: any) => ({
          id: item.idMeal,
          name: item.strMeal,
          description: "Choice of Corn, Tomato, Garlic, vegetable toppings, Red/White pepper, and meats.",
          price: parseFloat((Math.random() * 10 + 10).toFixed(0)),
          rating: Math.floor(Math.random() * 3) + 3,
          favorite: false,
          category: "Seafood",
          image: item.strMealThumb,
        }));
        setMenus(meals);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <>
        <TopBar />
        <div className={styles.loader}>Loading menu...</div>
      </>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      {/* TopBar stays outside the padded wrapper for full-width look */}
      <TopBar />

      <div className={styles["page-wrapper"]}>
        {/* Menu Grid */}
        <div className={styles["menu-container"]}>
          {menus.map(menu => (
            <div key={menu.id} className={styles["menu-card"]}>
              {/* Image Section */}
              <div className={styles["image-wrapper"]}>
                <img
                  src={menu.image}
                  alt={menu.name}
                  className={styles["menu-img"]}
                />
                <button
                  className={styles["favorite-btn"]}
                  onClick={() => toggleFavorite(menu.id)}
                >
                  {menu.favorite ? "❤️" : "🤍"}
                </button>
              </div>

              {/* Content Section */}
              <div className={styles["content-wrapper"]}>
                <div className={styles["title-row"]}>
                  <h2 className={styles["menu-name"]}>{menu.name}</h2>
                  <span className={styles["menu-price"]}>{menu.price}$</span>
                </div>

                <p className={styles["menu-description"]}>
                  {menu.description}
                </p>

                <div className={styles["footer-row"]}>
                  {renderStars(menu.rating)}
                  {/* The Orange Corner Button from your CSS */}
                  <button className={styles["add-btn"]}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className={styles["load-more-container"]}>
          <button className={styles["load-more-btn"]}>Load More</button>
        </div>
      </div>
    </div>
  );
}
