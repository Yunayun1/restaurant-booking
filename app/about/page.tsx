"use client";
import React from "react";
import TopBar from "@/app/landing/TopBar";
import styles from "./about.module.css";
import { Star, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className={styles["page-wrapper"]}>
      <TopBar />

      <main className={styles["content-wrapper"]}>
        
        {/* HERO SECTION */}
        <section className={styles["hero-section"]}>
          <div className={styles["hero-content"]}>
            <h1>
              Seamless Dining Starts with <span>BookingRest</span>
            </h1>
            <p>
              BookingRest is a modern restaurant reservation platform designed to 
              connect diners with their favorite restaurants effortlessly. 
              We help customers discover, book, and enjoy dining experiences 
              while empowering restaurants to manage reservations smoothly.
            </p>

            <div
              className={styles["star-container"]}
              style={{
                color: "#ffb400",
                display: "flex",
                gap: "5px",
                marginBottom: "20px",
              }}
            >
              <Star size={20} fill="#ffb400" />
              <Star size={20} fill="#ffb400" />
              <Star size={20} fill="#ffb400" />
              <Star size={20} fill="#ffb400" />
              <Star size={20} fill="#ffb400" />
            </div>
          </div>

          <div className={styles["hero-image-container"]}>
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1974"
              alt="Restaurant Booking Experience"
              className={styles["hero-img"]}
            />
          </div>
        </section>

        {/* STATS SECTION */}
        <section className={styles["stats-container"]}>
          <div className={styles["stat-card"]}>
            <span className={styles["stat-value"]}>500+</span>
            <span className={styles["stat-label"]}>Restaurants Partnered</span>
            <div className={styles["corner-accent"]} />
          </div>

          <div className={styles["stat-card"]}>
            <span className={styles["stat-value"]}>10K+</span>
            <span className={styles["stat-label"]}>Bookings Made</span>
            <div className={styles["corner-accent"]} />
          </div>

          <div className={styles["stat-card"]}>
            <span className={styles["stat-value"]}>24/7</span>
            <span className={styles["stat-label"]}>Online Reservations</span>
            <div className={styles["corner-accent"]} />
          </div>
        </section>

        {/* MISSION BOX */}
        <section className={styles["mission-box"]}>
          <ShieldCheck size={48} color="#ffb400" style={{ marginBottom: "1rem" }} />
          <h2>Our Mission</h2>
          <p>
            Our mission is to simplify restaurant reservations for everyone. 
            BookingRest helps diners save time and secure tables with ease, 
            while providing restaurants with powerful tools to manage bookings, 
            reduce no-shows, and enhance customer satisfaction.
          </p>
        </section>

      </main>
    </div>
  );
}
