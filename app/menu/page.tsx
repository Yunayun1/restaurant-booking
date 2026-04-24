"use client";

import { useEffect, useState, useMemo } from "react";
import styles from "./menu.module.css";
import TopBar from "../landing/TopBar";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  status: "Available" | "Out of Stock";
}

const CATEGORIES = ["All", "Food", "Drink"];

export default function MenuPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8);

  // 🔥 FIREBASE REALTIME FETCH
  useEffect(() => {
    const q = query(collection(db, "menuItems"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MenuItem[];

      setMenus(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔎 FILTER + SEARCH
  const filteredMenus = useMemo(() => {
    return menus.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      // 🚀 Only show available items
      const isAvailable = item.status === "Available";

      return matchesSearch && matchesCategory && isAvailable;
    });
  }, [searchQuery, selectedCategory, menus]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
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
        {/* Search + Filter */}
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
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`${styles["category-chip"]} ${
                  selectedCategory === cat ? styles["active-chip"] : ""
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* MENU GRID */}
        <div className={styles["menu-container"]}>
          {filteredMenus.slice(0, visibleCount).map((menu) => (
            <div key={menu.id} className={styles["menu-card"]}>
              <div className={styles["image-wrapper"]}>
                <img
                  src={menu.image || "/placeholder.png"}
                  alt={menu.name}
                  className={styles["menu-img"]}
                />
              </div>

              <div className={styles["content-wrapper"]}>
                <div className={styles["title-row"]}>
                  <h2 className={styles["menu-name"]}>{menu.name}</h2>
                  <span className={styles["menu-price"]}>
                    ${menu.price.toFixed(2)}
                  </span>
                </div>

                <p className={styles["menu-description"]}>
                  {menu.description}
                </p>

                <div className={styles["footer-row"]}>
                  <span style={{ fontSize: "12px", color: "green" }}>
                    Available
                  </span>

                  <button className={styles["add-btn"]}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredMenus.length === 0 && (
          <div className={styles["no-results"]}>
            No dishes found matching your criteria.
          </div>
        )}

        {/* LOAD MORE */}
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