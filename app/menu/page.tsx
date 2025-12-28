"use client";

import React from "react";
import { fakeFoods, Food } from "../data/foods";

export default function MenuPage() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>Menu</h1>

      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        }}
      >
        {fakeFoods.map((food: Food) => (
          <div
            key={food.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={food.image}
              alt={food.name}
              style={{ width: "100%", height: "160px", objectFit: "cover" }}
            />
            <div style={{ padding: "1rem" }}>
              <h3 style={{ margin: "0 0 0.5rem 0", fontWeight: 600 }}>{food.name}</h3>
              <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", color: "#555" }}>
                {food.description}
              </p>
              <p style={{ fontWeight: "bold", fontSize: "1rem" }}>${food.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
