"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar, Clock, Users, Phone, 
  ChevronRight, ClipboardList, CheckCircle2, History,
  ArrowLeft 
} from "lucide-react";

// FIREBASE IMPORTS
import { db } from "@/lib/firebase"; // Adjust this path to your firebase config
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";

import TopBar from "@/app/landing/TopBar"; 
import styles from "./booking.module.css";

interface Booking {
  id: string;
  date: string;
  time: string;
  people: number;
  status: "Pending" | "Approved" | "Rejected";
  email: string; // To link booking to user
}

export default function BookingPage() {
  const router = useRouter();
  
  const [user, setUser] = useState<{ name?: string; phone?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true); 
  const [submitting, setSubmitting] = useState(false); // New state for button loading
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    people: 1,
    phone: "",
  });
  const [myBookings, setMyBookings] = useState<Booking[]>([]);

  // 1. AUTH & FETCH DATA
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      localStorage.setItem("redirectAfterLogin", "/booking");
      router.push("/auth/login");
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData((prev) => ({ ...prev, phone: parsedUser.phone || "" }));
      
      // Fetch bookings for this specific user
      fetchUserBookings(parsedUser.email);
      setLoading(false);
    }
  }, [router]);

  // 2. FETCH FROM FIREBASE
  const fetchUserBookings = async (email: string) => {
    try {
      const q = query(
        collection(db, "bookings"),
        where("email", "==", email),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const bookingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      setMyBookings(bookingsData);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  // 3. SAVE TO FIREBASE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return alert("User not identified!");

    setSubmitting(true);
    
    const newBookingData = {
      email: user.email,
      name: user.name || "Guest",
      date: formData.date,
      time: formData.time,
      people: formData.people,
      phone: formData.phone,
      status: "Pending",
      createdAt: Timestamp.now(),
    };

    try {
      const docRef = await addDoc(collection(db, "bookings"), newBookingData);
      
      // Update local state to show the new booking immediately
      setMyBookings([{ id: docRef.id, ...newBookingData } as Booking, ...myBookings]);
      
      // Reset form
      setFormData({ ...formData, date: "", time: "" });
      alert("Booking request sent successfully!");
    } catch (err) {
      console.error("Firebase Error:", err);
      alert("Failed to save booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#64748b', fontWeight: '600' }}>Verifying your session...</p>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <TopBar />

      <div className={styles.container}>
        <button onClick={() => router.push("/")} className={styles.backBtn}>
          <ArrowLeft size={20} /> Back to Home
        </button>

        <div className={styles.headerSection}>
          <h1 className={styles.title}>
            Book Your <span className={styles.accentText}>Experience</span>
          </h1>
          <p className={styles.subtitle}>
            Hello, <strong>{user?.name || "Guest"}</strong>. Let's find the perfect table.
          </p>
        </div>

        <div className={styles.grid}>
          {/* LEFT: FORM */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <ClipboardList color="#ffb400" size={24} />
              <h3>Reservation Details</h3>
            </div>

            <form onSubmit={handleSubmit} className={styles.formGroup}>
              <label className={styles.label}>
                <Calendar size={16} /> Date
                <input
                  type="date"
                  required
                  className={styles.input}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </label>

              <div className={styles.inputRow}>
                <label className={styles.label}>
                  <Clock size={16} /> Time
                  <input
                    type="time"
                    required
                    className={styles.input}
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </label>

                <label className={styles.label}>
                  <Users size={16} /> Guests
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    className={styles.input}
                    value={formData.people}
                    onChange={(e) => setFormData({ ...formData, people: Number(e.target.value) })}
                  />
                </label>
              </div>

              <label className={styles.label}>
                <Phone size={16} /> Phone
                <input
                  type="tel"
                  required
                  className={styles.input}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </label>

              <button 
                type="submit" 
                className={styles.submitBtn} 
                disabled={submitting}
              >
                {submitting ? "Processing..." : "Confirm Reservation"} 
                {!submitting && <ChevronRight size={18} />}
              </button>
            </form>
          </div>

          {/* RIGHT: HISTORY */}
          <div className={`${styles.card} ${styles.historyCard}`}>
            <div className={styles.cardHeader}>
              <History color="#ffb400" size={24} />
              <h3>Your History</h3>
            </div>

            {myBookings.length === 0 ? (
              <p className={styles.empty}>No booking yet.</p>
            ) : (
              <div className={styles.historyList}>
                {myBookings.map((b) => (
                  <div key={b.id} className={styles.bookingItem}>
                    <div>
                      <strong>{b.date}</strong>
                      <p>{b.time} • {b.people} guests</p>
                    </div>
                    <span className={`${styles.status} ${styles[b.status.toLowerCase()]}`}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            <div style={{ marginTop: "20px", display: "flex", gap: "10px", opacity: 0.7 }}>
              <CheckCircle2 size={16} color="#ffb400" />
              <p style={{ fontSize: "0.8rem", margin: 0 }}>Approved bookings will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}