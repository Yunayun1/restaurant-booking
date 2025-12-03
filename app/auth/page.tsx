"use client";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const login = () => {
    // after login go to home
    router.push("/home");
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Login / Register</h1>

      <button
        onClick={login}
        style={{
          marginTop: "20px",
          background: "#ffb400",
          padding: "10px 25px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Continue
      </button>
    </div>
  );
}
