"use client";

import { useEffect, useState, useMemo } from "react";
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

const CATEGORIES = ["All", "Seafood", "Chicken", "Dessert", "Pasta"];

export default function MenuPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New States for Search and Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8); // For Load More

  useEffect(() => {
    // Fetching more categories to make the filtering more interesting
    const fetchMenu = async () => {
      try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
        const data = await response.json();
        
        const meals = data.meals.map((item: any) => ({
          id: item.idMeal,
          name: item.strMeal,
          description: item.strInstructions ? item.strInstructions.slice(0, 80) + "..." : "Delicious chef specialty.",
          price: parseFloat((Math.random() * 10 + 10).toFixed(0)),
          rating: Math.floor(Math.random() * 3) + 3,
          favorite: false,
          category: item.strCategory || "Seafood",
          image: item.strMealThumb,
        }));
        
        setMenus(meals);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu:", error);
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Filter Logic
  const filteredMenus = useMemo(() => {
    return menus.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, menus]);

  const toggleFavorite = (id: string) => {
    setMenus(prev =>
      prev.map(menu =>
        menu.id === id ? { ...menu, favorite: !menu.favorite } : menu
      )
    );
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4);
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
      <TopBar />

      <div className={styles["page-wrapper"]}>
        {/* Search and Filter Section */}
        <div className={styles["controls-section"]}>
          <div className={styles["search-box"]}>
            <input 
              type="text" 
              placeholder="Search for food..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className={styles["category-list"]}>
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`${styles["category-chip"]} ${selectedCategory === cat ? styles["active-chip"] : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className={styles["menu-container"]}>
          {filteredMenus.slice(0, visibleCount).map(menu => (
            <div key={menu.id} className={styles["menu-card"]}>
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
                  <button className={styles["add-btn"]}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMenus.length === 0 && (
          <div className={styles["no-results"]}>No dishes found matching your criteria.</div>
        )}

        {/* Load More Button */}
        {visibleCount < filteredMenus.length && (
          <div className={styles["load-more-container"]}>
            <button 
              className={styles["load-more-btn"]}
              onClick={handleLoadMore}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}