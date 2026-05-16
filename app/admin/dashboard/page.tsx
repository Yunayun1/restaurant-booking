"use client";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Users, Calendar, Clock, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [upcoming, setUpcoming] = useState<any[]>([]);

  const getDisplayName = (name?: string, email?: string) => {
    return name && name.trim() !== "" ? name : (email ? email.split("@")[0] : "Guest");
  };

  useEffect(() => {
    // Listen to the entire bookings collection for real-time stats
    const q = query(collection(db, "bookings"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allBookings = snapshot.docs.map(doc => doc.data());
      
      // Get today's date string in the same format as your booking data (e.g., "2026-01-02")
      const todayStr = new Date().toISOString().split('T')[0];

      const statsUpdate = {
        total: allBookings.length,
        today: allBookings.filter((b: any) => b.date === todayStr).length,
        pending: allBookings.filter((b: any) => b.status === "Pending").length,
      };

      setStats(statsUpdate);
      // Compute upcoming bookings (date >= today and not rejected) and sort ascending
      const upcomingList = (allBookings as any[])
        .filter(b => b && b.date >= todayStr && b.status !== "Rejected")
        .sort((a, b) => {
          const aDate = new Date(`${a.date}T${a.time || '00:00'}`);
          const bDate = new Date(`${b.date}T${b.time || '00:00'}`);
          return aDate.getTime() - bDate.getTime();
        })
        .slice(0, 3);

      setUpcoming(upcomingList);

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Inter, sans-serif", backgroundColor: "#fbfbfb", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#1a1a1a", letterSpacing: "-0.5px" }}>
        Admin Dashboard
      </h1>

      <p style={{ marginTop: "4px", color: "#64748b", fontSize: "0.95rem" }}>
        Real-time restaurant performance overview
      </p>

      {/* Stats Grid */}
      <div style={{ display: "flex", gap: "25px", marginTop: "35px", flexWrap: "wrap" }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#ffb600" }}>
            <Loader2 className="animate-spin" /> Fetching latest data...
          </div>
        ) : (
          <>
            <DashboardCard 
              title="Total Bookings" 
              value={stats.total.toString()} 
              icon={<Users size={20} color="#ffb600" />} 
            />
            <DashboardCard 
              title="Today's Bookings" 
              value={stats.today.toString()} 
              icon={<Calendar size={20} color="#ffb600" />} 
            />
            <DashboardCard 
              title="Pending Approval" 
              value={stats.pending.toString()} 
              icon={<Clock size={20} color="#ffb600" />} 
              isWarning={stats.pending > 0}
            />
          </>
        )}
      </div>

      {/* Upcoming Guests Section (styled) */}
      <div style={{ marginTop: "30px" }}>
        <h2 style={{ fontSize: "13px", marginBottom: "12px", color: "#7b5f2e", textTransform: "uppercase", letterSpacing: "1px" }}>Upcoming</h2>

        {loading ? (
          <div style={{ color: "#ffb600", display: "flex", alignItems: "center", gap: 8 }}><Loader2 className="animate-spin" /> Loading...</div>
        ) : upcoming.length === 0 ? (
          <div style={{ padding: "18px", background: "#fff", borderRadius: "12px", border: "1px solid #f0f0f0" }}>
            No upcoming reservations.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
            {upcoming.map((b, idx) => (
              <div key={idx} style={{ background: "#fff7eb", padding: "16px 20px", borderRadius: "14px", border: "1px solid #fae6c9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#1b1b1b" }}>{b.date} {b.time ? ` ${b.time}` : ""}</div>
                  <div style={{ marginTop: "6px", color: "#3f3f3f", fontWeight: 700 }}>{getDisplayName(b.name, b.email)}</div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, color: "#8a4b08" }}>{b.tableNumber || "—"} · {b.people} guests</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface CardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  isWarning?: boolean;
}

function DashboardCard({ title, value, icon, isWarning }: CardProps) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "24px",
        borderRadius: "16px",
        width: "260px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        border: isWarning ? "1px solid #ffb600" : "1px solid #f0f0f0",
        transition: "transform 0.2s ease",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {title}
        </h3>
        <div style={{ background: "#fff7ed", padding: "8px", borderRadius: "10px" }}>
          {icon}
        </div>
      </div>
      <p style={{ fontSize: "32px", fontWeight: "800", color: "#1a1a1a", margin: 0 }}>
        {value}
      </p>
    </div>
  );
}