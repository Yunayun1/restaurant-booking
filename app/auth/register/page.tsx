"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/authService";
import { ArrowRight, User, Mail, Lock } from "lucide-react";
import styles from "./Register.module.css"; 

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await registerUser(username, email, password);
      localStorage.setItem("user", JSON.stringify(user));

      const redirectPath = localStorage.getItem("redirectAfterLogin") || "/landing";
      localStorage.removeItem("redirectAfterLogin");
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.registerCard}>
        <div className={styles.header}>
          <h2>Create Account</h2>
          <p>Join us to start booking your tables.</p>
        </div>

        <form onSubmit={handleRegister} className={styles.formGroup}>
          <div className={styles.inputWrapper}>
            <User className={styles.inputIcon} size={20} />
            <input
              placeholder="Username"
              className={styles.input}
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className={styles.inputWrapper}>
            <Mail className={styles.inputIcon} size={20} />
            <input
              type="email"
              placeholder="Email Address"
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

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Creating account..." : "Register"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <p className={styles.footer}>
          Already have an account?{" "}
          <span className={styles.link} onClick={() => router.push("/auth/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}