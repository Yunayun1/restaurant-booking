"use client";
import React from "react";
import TopBar from "@/app/landing/TopBar";
import styles from "./about.module.css";
import { ArrowRight, Star, Globe, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className={styles["page-wrapper"]}>
      <TopBar />

      <main className={styles["content-wrapper"]}>
        
        {/* HERO SECTION */}
        <section className={styles["hero-section"]}>
          <div className={styles["hero-content"]}>
            <h1>Crafting <span>Memories</span> Through Flavor.</h1>
            <p>
              We are a global culinary group dedicated to providing world-class 
              dining experiences. From our humble beginnings to becoming a 
              pioneer in the industry, our focus has always been on quality, 
              innovation, and our guests.
            </p>
            <div className={styles["star-container"]} style={{ color: '#ffb400', display: 'flex', gap: '5px', marginBottom: '20px' }}>
              <Star size={20} fill="#ffb400" />
              <Star size={20} fill="#ffb400" />
              <Star size={20} fill="#ffb400" />
              <Star size={20} fill="#ffb400" />
              <Star size={20} fill="#ffb400" />
            </div>
          </div>

          <div className={styles["hero-image-container"]}>
            <img 
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974" 
              alt="Our Restaurant Interior" 
              className={styles["hero-img"]}
            />
          </div>
        </section>

        {/* STATS SECTION */}
        <section className={styles["stats-container"]}>
          <div className={styles["stat-card"]}>
            <span className={styles["stat-value"]}>15+</span>
            <span className={styles["stat-label"]}>Years Excellence</span>
            <div className={styles["corner-accent"]} />
          </div>
          <div className={styles["stat-card"]}>
            <span className={styles["stat-value"]}>24</span>
            <span className={styles["stat-label"]}>Luxury Locations</span>
            <div className={styles["corner-accent"]} />
          </div>
          <div className={styles["stat-card"]}>
            <span className={styles["stat-value"]}>100%</span>
            <span className={styles["stat-label"]}>Organic Sourcing</span>
            <div className={styles["corner-accent"]} />
          </div>
        </section>

        {/* MISSION BOX */}
        <section className={styles["mission-box"]}>
          <ShieldCheck size={48} color="#ffb400" style={{ marginBottom: '1rem' }} />
          <h2>The Gold Standard</h2>
          <p>
            Our commitment to excellence is reflected in every plate we serve. 
            We partner with local artisans and sustainable farms to ensure that 
            every ingredient meets our rigorous standards of freshness and flavor.
          </p>
        </section>

      </main>
    </div>
  );
}