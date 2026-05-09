"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "./reservation.module.css";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Calendar, 
  Search,
  Filter,
  ArrowUpRight
} from "lucide-react";

export default function AdminReservations() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const docRef = doc(db, "bookings", id);
    await updateDoc(docRef, { status });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const filteredBookings = bookings.filter(b => 
    b.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className={styles.loader}>Loading Admin Dashboard...</div>;

  return (
    <div className={styles["page-wrapper"]}>
      
      <main className={styles["content-wrapper"]}>
        {/* DASHBOARD HEADER */}
        <div className={styles["history-header"]}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Reservations Central</h1>
            <p style={{ color: '#777' }}>Manage and monitor all incoming guest bookings</p>
          </div>
          <div className={styles["stats-pill"]}>
            <ArrowUpRight size={16} /> {bookings.length} Total Bookings
          </div>
        </div>

        {/* CONTROLS */}
        <section className={styles["controls-section"]}>
          <div className={styles["search-box"]}>
            <input 
              type="text" 
              placeholder="Search by booking ID, guest name, or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        {/* ADMIN TABLE/GRID */}
        <div className={styles["menu-container"]}>
          {filteredBookings.map((b) => (
            <div key={b.id} className={styles["menu-card"]} style={{ padding: '1.5rem' }}>
              <div className={styles["title-row"]}>
                <h3 className={styles["menu-name"]}>{b.name || "Guest User"}</h3>
                <span className={styles["menu-price"]} style={{ fontSize: '1rem', color: '#ffb400' }}>
                  #{b.id.slice(0, 5)}
                </span>
              </div>
              
              <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>{b.email}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                <div className={styles["cardRow"]}><Calendar size={16} /> {b.date}</div>
                <div className={styles["cardRow"]}><Clock size={16} /> {b.time}</div>
                <div className={styles["cardRow"]}><Users size={16} /> {b.people} Pax</div>
              </div>

              {/* ACTION FOOTER */}
              <div className={styles["footer-row"]} style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                <div className={`
                  ${styles.statusChip} 
                  ${b.status === "Pending" ? styles.statusPending : 
                    b.status === "Approved" ? styles.statusApproved : 
                    b.status === "Complete" ? styles.statusComplete : styles.statusRejected}
                `}>
                  {b.status}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => updateStatus(b.id, "Rejected")}
                    className={styles["category-chip"]} 
                    style={{ borderColor: '#ff4747', color: '#ff4747', padding: '5px 12px' }}
                  >
                    <XCircle size={16} />
                  </button>
                  <button 
                    onClick={() => updateStatus(b.id, "Complete")}
                    className={styles["active-chip"]} 
                    style={{ padding: '5px 12px' }}
                  >
                    <CheckCircle size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}