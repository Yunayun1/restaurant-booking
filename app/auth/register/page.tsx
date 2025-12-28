"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/authService";
import { ArrowRight } from "lucide-react";

// Shared colors and styles
const ACCENT_COLOR = "#ffb400";
const PRIMARY_TEXT = "#212121";
const CARD_BACKGROUND = "rgba(255, 255, 255, 0.95)";
const BG_OVERLAY = "rgba(0, 0, 0, 0.6)";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      // Call registerUser function
      const user = await registerUser(username, email, password);

      // ✅ Save user to localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Redirect to landing page
      router.push("/landing");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
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
        position: "relative",
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

      {/* Registration Card */}
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
          Create Account
        </h2>

        <form
          onSubmit={handleRegister}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {/* Username Input */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              padding: "14px 18px",
              borderRadius: "10px",
              border: `1px solid ${PRIMARY_TEXT}60`,
              fontSize: "1rem",
              backgroundColor: "white",
              color: PRIMARY_TEXT,
              transition: "border-color 0.3s",
            }}
          />

          {/* Email Input */}
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
              backgroundColor: "white",
              color: PRIMARY_TEXT,
            }}
          />

          {/* Password Input */}
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
              backgroundColor: "white",
              color: PRIMARY_TEXT,
            }}
          />

          {/* Register Button */}
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
              transition: "opacity 0.3s, transform 0.1s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Register
            <ArrowRight size={20} color={PRIMARY_TEXT} />
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <p style={{ color: "#d9534f", marginTop: 15, fontWeight: 500 }}>
            {error}
          </p>
        )}

        {/* Login Link */}
        <p style={{ marginTop: 25, fontSize: "0.95rem", color: PRIMARY_TEXT }}>
          Already have an account?{" "}
          <span
            onClick={() => router.push("/auth/login")}
            style={{
              color: ACCENT_COLOR,
              cursor: "pointer",
              fontWeight: "bold",
              textDecoration: "underline",
              textDecorationColor: ACCENT_COLOR,
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
