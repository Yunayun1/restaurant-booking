"use client";

import { useEffect, useState, useMemo } from "react";
import styles from "./menu.module.css";
import TopBar from "../landing/TopBar";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  status: "Available" | "Out of Stock";
  tag?: string; 
}

export default function MenuPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const availableMenus = useMemo(() => {
    return menus.filter(m => m.status === "Available");
  }, [menus]);

  const searchResults = useMemo(() => {
    return availableMenus.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, availableMenus]);

  const MenuSection = ({ title, items }: { title: string, items: MenuItem[] }) => {
    if (items.length === 0) return null;

    return (
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <div className={styles.titleUnderline}></div>
        </div>
        
        <div className={styles.grid}>
          {items.map((menu) => (
            <div key={menu.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={menu.image || "/placeholder.png"} alt={menu.name} loading="lazy" />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.row}>
                  <h3 className={styles.name}>{menu.name}</h3>
                  <div className={styles.priceTag}>${menu.price.toFixed(2)}</div>
                </div>
                <p className={styles.desc}>{menu.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  if (loading) return <div className={styles.loading}><span>GATHERING INGREDIENTS...</span></div>;

  return (
    <div className={styles.container}>
      <TopBar />
      <main className={styles.viewport}>
        <div className={styles.heroSection}>
          <div className={styles.topNav}>
            <h1 className={styles.logoText}>Our Menu</h1>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={18} />
              <input
                type="text"
                placeholder="Find your favorite dish..."
                className={styles.input}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.stack}>
          {searchQuery ? (
            <MenuSection title="Results" items={searchResults} />
          ) : (
            <>
              <MenuSection title="Recommended" items={availableMenus.filter(m => m.tag === "Recommended")} />
              <MenuSection title="Famous Food" items={availableMenus.filter(m => m.tag === "Famous")} />
              <MenuSection title="Food" items={availableMenus.filter(m => m.category === "Food")} />
              <MenuSection title="Drink" items={availableMenus.filter(m => m.category === "Drink")} />
              <MenuSection title="Dessert" items={availableMenus.filter(m => m.category === "Dessert")} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}