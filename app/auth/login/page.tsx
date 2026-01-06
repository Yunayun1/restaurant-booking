"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/authService";
import { ArrowRight, Lock, Mail } from "lucide-react";
import styles from "./Login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Admin credentials
  const ADMIN_EMAIL = "admin@example.com";
  const ADMIN_PASSWORD = "123456"; 

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Check for admin login first
      if (email === ADMIN_EMAIL) {
        if (password !== ADMIN_PASSWORD) {
          throw new Error("Incorrect admin password.");
        }

        // Admin login successful
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: "Admin",
            email: ADMIN_EMAIL,
            role: "admin",
          })
        );

        router.push("/admin/dashboard");
        return;
      }

      // Normal user login
      await loginUser(email, password);

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: email.split("@")[0],
          email,
          role: "user",
        })
      );

      router.push("/landing");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h2>Welcome Back</h2>
          <p>Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleLogin} className={styles.formGroup}>
          <div className={styles.inputWrapper}>
            <Mail className={styles.inputIcon} size={20} />
            <input
              type="email"
              placeholder="Email address"
              className={styles.input}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.inputWrapper}>
            <Lock className={styles.inputIcon} size={20} />
            <input
              type="password"
              placeholder="Password"
              className={styles.input}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"} 
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <p className={styles.footer}>
          Don’t have an account?
          <span className={styles.link} onClick={() => router.push("/auth/register")}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
