"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar, Clock, Users, Phone, 
  ChevronRight, ClipboardList, CheckCircle2, History,
  ArrowLeft 
} from "lucide-react";
import TopBar from "../landing/TopBar"; // Ensure this path matches your folder structure

const styles = {
  primaryTextColor: "#1a1a1a",
  accentColor: "#ffb400",
  secondaryTextColor: "#64748b",
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    padding: "35px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
    border: "1px solid #f1f5f9",
    transition: "transform 0.3s ease",
  } as React.CSSProperties,
  primaryButton: {
    backgroundColor: "#ffb400",
    padding: "16px 30px",
    borderRadius: "14px",
    border: "none",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    color: "#1a1a1a",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    boxShadow: "0 10px 25px rgba(255, 180, 0, 0.25)",
    width: "100%",
    marginTop: "10px"
  } as React.CSSProperties,
  input: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    fontSize: "1rem",
    marginTop: "8px",
    outline: "none",
    fontFamily: "inherit",
    backgroundColor: "#f8fafc"
  } as React.CSSProperties,
  label: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#475569",
    marginTop: "16px"
  } as React.CSSProperties,
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "none",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
    fontWeight: "600",
    marginBottom: "24px",
    padding: "0",
    fontSize: "1rem",
    transition: "color 0.2s"
  } as React.CSSProperties
};

interface Booking {
  id: string;
  date: string;
  time: string;
  people: number;
  status: "Pending" | "Approved" | "Rejected";
}

export default function BookingPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; phone?: string } | null>(null);
  const [formData, setFormData] = useState({ date: "", time: "", people: 1, phone: "" });
  const [myBookings, setMyBookings] = useState<Booking[]>([]);

  // 1. Auth & Data Load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      localStorage.setItem("redirectAfterLogin", "/booking");
      router.push("/auth/login");
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData((prev) => ({ ...prev, phone: parsedUser.phone || "" }));
    }
  }, [router]);

  // 2. Form Submission logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new mock booking for the UI
    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      status: "Pending",
    };

    // Update local list (In real app, this would be a POST to your Express server)
    setMyBookings([newBooking, ...myBookings]);
    
    // Reset inputs
    setFormData({ ...formData, date: "", time: "" });
    alert("Booking request sent! Our admin will review it shortly.");
  };

  if (!user) return null;

  return (
    <div style={{ backgroundColor: "#fdfdfd", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <TopBar />

      <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 20px" }}>
        
        {/* 🔙 BACK BUTTON */}
        <button 
          onClick={() => router.push("/")}
          style={styles.backBtn}
          onMouseEnter={(e) => e.currentTarget.style.color = styles.primaryTextColor}
          onMouseLeave={(e) => e.currentTarget.style.color = styles.secondaryTextColor}
        >
          <ArrowLeft size={20} /> Back to Home
        </button>

        {/* Header Section */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "900", color: styles.primaryTextColor, marginBottom: "8px", letterSpacing: "-0.02em" }}>
            Book Your <span style={{ color: styles.accentColor }}>Experience</span>
          </h1>
          <p style={{ color: styles.secondaryTextColor, fontSize: "1.1rem" }}>
            Hello, <strong>{user.name}</strong>. Let's find the perfect table for you.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "30px", alignItems: "start" }}>
          
          {/* --- LEFT: RESERVATION FORM --- */}
          <div style={styles.card}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{ backgroundColor: "#fffbeb", padding: "10px", borderRadius: "12px" }}>
                <ClipboardList color={styles.accentColor} size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "800" }}>Reservation Details</h3>
            </div>

            <form onSubmit={handleSubmit}>
              <label style={styles.label}><Calendar size={16}/> Date</label>
              <input type="date" required style={styles.input} value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <label style={styles.label}><Clock size={16}/> Time</label>
                  <input type="time" required style={styles.input} value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
                </div>
                <div>
                  <label style={styles.label}><Users size={16}/> Guests</label>
                  <input type="number" min="1" max="20" required style={styles.input} value={formData.people} onChange={(e) => setFormData({...formData, people: parseInt(e.target.value)})} />
                </div>
              </div>

              <label style={styles.label}><Phone size={16}/> Phone Number</label>
              <input type="tel" placeholder="012 345 678" required style={styles.input} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />

              <button type="submit" style={styles.primaryButton}>
                Confirm Reservation <ChevronRight size={18} />
              </button>
            </form>
          </div>

          {/* --- RIGHT: BOOKING STATUS --- */}
          <div style={{ ...styles.card, backgroundColor: styles.primaryTextColor, color: "white" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "30px" }}>
              <div style={{ backgroundColor: "rgba(255,180,0,0.1)", padding: "10px", borderRadius: "12px" }}>
                <History color={styles.accentColor} size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "800" }}>Your History</h3>
            </div>

            {myBookings.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>
                <p>No active booking requests found.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {myBookings.map((b) => (
                  <div key={b.id} style={{ 
                    padding: "20px", 
                    borderRadius: "16px", 
                    backgroundColor: "rgba(255,255,255,0.05)", 
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "1.1rem", marginBottom: "4px" }}>{b.date}</div>
                      <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{b.time} • {b.people} Guests</div>
                    </div>
                    <div style={{ 
                      display: "flex", alignItems: "center", gap: "6px",
                      color: b.status === "Pending" ? styles.accentColor : "#4ade80",
                      fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px"
                    }}>
                      <div style={{ 
                        width: "8px", height: "8px", borderRadius: "50%", 
                        backgroundColor: b.status === "Pending" ? styles.accentColor : "#4ade80",
                        boxShadow: `0 0 10px ${b.status === "Pending" ? styles.accentColor : "#4ade80"}`
                      }} />
                      {b.status}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: "30px", padding: "20px", borderRadius: "16px", backgroundColor: "rgba(255,180,0,0.1)", display: "flex", gap: "15px" }}>
               <CheckCircle2 color={styles.accentColor} size={20} />
               <p style={{ fontSize: "0.85rem", margin: 0, color: "rgba(255,255,255,0.7)", lineHeight: "1.5" }}>
                 Our team will review your request. Please check this dashboard for status updates.
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}