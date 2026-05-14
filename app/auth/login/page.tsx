"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { db, auth } from "@/firebase";

import {
  ArrowRight,
  Lock,
  Mail,
} from "lucide-react";

import styles from "./Login.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");

    setLoading(true);

    try {
      // Login with Firebase Auth
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      // Check if user is admin
      const adminQuery = query(
        collection(db, "admins"),
        where(
          "email",
          "==",
          email.toLowerCase()
        )
      );

      const adminSnapshot =
        await getDocs(adminQuery);

      // If admin exists
      if (!adminSnapshot.empty) {
        const adminData =
          adminSnapshot.docs[0].data();

        // Save admin session
        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            role:
              adminData.role || "admin",
          })
        );

        router.push("/admin/dashboard");

        return;
      }

      // Normal User
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          name:
            email.split("@")[0],
          email: user.email,
          role: "user",
        })
      );

      router.push("/landing");

    } catch (err: any) {
      console.error(err);

      if (
        err.code ===
        "auth/invalid-credential"
      ) {
        setError(
          "Invalid email or password"
        );
      } else if (
        err.code ===
        "auth/user-not-found"
      ) {
        setError("User not found");
      } else if (
        err.code ===
        "auth/wrong-password"
      ) {
        setError("Incorrect password");
      } else {
        setError(
          err.message ||
            "Login failed"
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h2>Welcome Back</h2>

          <p>
            Please enter your details
            to sign in.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className={styles.formGroup}
        >
          {/* Email */}
          <div
            className={
              styles.inputWrapper
            }
          >
            <Mail
              className={
                styles.inputIcon
              }
              size={20}
            />

            <input
              type="email"
              placeholder="Email address"
              className={
                styles.input
              }
              required
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />
          </div>

          {/* Password */}
          <div
            className={
              styles.inputWrapper
            }
          >
            <Lock
              className={
                styles.inputIcon
              }
              size={20}
            />

            <input
              type="password"
              placeholder="Password"
              className={
                styles.input
              }
              required
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className={
              styles.submitBtn
            }
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Login"}

            {!loading && (
              <ArrowRight size={18} />
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className={styles.errorMsg}>
            {error}
          </div>
        )}

        {/* Footer */}
        <p className={styles.footer}>
          Don’t have an account?

          <span
            className={styles.link}
            onClick={() =>
              router.push(
                "/auth/register"
              )
            }
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}