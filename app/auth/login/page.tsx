// app/auth/login/LoginPage.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/authService";
import { ArrowRight } from "lucide-react"; 

// Styles & colors
const ACCENT_COLOR = "#ffb400";
const PRIMARY_TEXT = "#212121";
const CARD_BACKGROUND = "rgba(255, 255, 255, 0.95)";
const BG_OVERLAY = "rgba(0, 0, 0, 0.6)";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      // ✅ LOGIN
      await loginUser(email, password);

      // ✅ SAVE USER (for TopBar profile circle)
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: email.split("@")[0], // example: yuna@gmail.com → yuna
          email,
        })
      );

      // ✅ REDIRECT TO HOMEPAGE
      router.push("/landing");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/res4.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "sans-serif",
      }}
    >
      {/* Background Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: BG_OVERLAY,
        }}
      />

      {/* Login Card */}
      <div
        style={{
          zIndex: 10,
          width: "90%",
          maxWidth: "420px",
          padding: "40px 30px",
          backgroundColor: CARD_BACKGROUND,
          borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
          textAlign: "center",
          backdropFilter: "blur(2px)",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            marginBottom: "30px",
            color: PRIMARY_TEXT,
          }}
        >
          Welcome
        </h2>

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "14px 18px",
              borderRadius: "10px",
              border: `1px solid ${PRIMARY_TEXT}60`,
              fontSize: "1rem",
              color: PRIMARY_TEXT,
            }}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "14px 18px",
              borderRadius: "10px",
              border: `1px solid ${PRIMARY_TEXT}60`,
              fontSize: "1rem",
              color: PRIMARY_TEXT,
            }}
          />

          {/* Login Button */}
          <button
            type="submit"
            style={{
              padding: "15px 20px",
              backgroundColor: ACCENT_COLOR,
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
              color: PRIMARY_TEXT,
              fontSize: "1.1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            Log In
            <ArrowRight size={20} color={PRIMARY_TEXT} />
          </button>
        </form>

        {/* Error */}
        {error && (
          <p style={{ color: "#d9534f", marginTop: 15, fontWeight: 500 }}>
            {error}
          </p>
        )}

        {/* Sign Up Link */}
        <p style={{ marginTop: 25, fontSize: "0.95rem", color: PRIMARY_TEXT }}>
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/auth/register")}
            style={{
              color: ACCENT_COLOR,
              cursor: "pointer",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
