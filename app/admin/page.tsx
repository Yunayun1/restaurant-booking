"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, Loader2, ShieldCheck } from "lucide-react";
import styles from "./Admin.module.css"; // IMPORTANT IMPORT

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const adminRef = doc(db, "admins", user.uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        setError("Access Denied: You are not an admin.");
        setLoading(false);
        return;
      }

      localStorage.setItem("admin", "true");
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.adminIconBadge}>
            <ShieldCheck size={32} />
          </div>
          <h2>Admin Portal</h2>
          <p>Secure access for system management</p>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.inputWrapper}>
            <Mail className={styles.inputIcon} size={18} />
            <input
              className={styles.input}
              type="email"
              placeholder="Admin Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.inputWrapper}>
            <Lock className={styles.inputIcon} size={18} />
            <input
              className={styles.input}
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <button 
            className={styles.submitBtn} 
            onClick={handleLogin} 
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <span>Sign In to Dashboard</span>
                <LogIn size={20} />
              </>
            )}
          </button>
        </div>

        <div className={styles.footer}>
          Need help? <span className={styles.link}>Contact Developer</span>
        </div>
      </div>
    </div>
  );
}