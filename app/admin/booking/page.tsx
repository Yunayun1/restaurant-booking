"use client";
import React, { useEffect, useState } from "react";
import { 
  collection, getDocs, updateDoc, deleteDoc, 
  doc, orderBy, query, addDoc, serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, Filter, Trash2, Check, X, Plus, BellRing } from "lucide-react";
import styles from "./adminBookings.module.css";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  people: number;
  status: "Pending" | "Approved" | "Rejected";
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      setBookings(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  // --- UPDATED updateStatus FUNCTION ---
  const updateStatus = async (booking: Booking, status: "Approved" | "Rejected") => {
    setUpdatingId(booking.id);
    try {
      // 1. Update the Booking Status in 'bookings' collection
      const bookingRef = doc(db, "bookings", booking.id);
      await updateDoc(bookingRef, { status });

      // 2. CREATE MESSAGE 
      // Adding isAdmin: true is what triggers the badge in TopBar.tsx
      await addDoc(collection(db, "messages"), {
        email: booking.email, 
        title: `Booking ${status}!`,
        content: `Hi ${booking.name}, your table for ${booking.people} pax on ${booking.date} at ${booking.time} has been ${status.toLowerCase()}.`,
        read: false,
        isAdmin: true, // IMPORTANT: Triggers the notification badge
        createdAt: serverTimestamp(), 
      });

      // 3. Update local state for immediate UI feedback
      setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status } : b));
      
    } catch (err) {
      console.error("Error in approval flow:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this reservation?")) return;
    try {
      await deleteDoc(doc(db, "bookings", id));
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) { console.error("Error deleting:", err); }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         b.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className={styles.emptyState}>Loading Enterprise Data...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Manage Bookings</h1>
          <p className={styles.subtitle}>Review and manage customer reservations</p>
        </div>
        <button className={styles.addBtn}><Plus size={18} /> New Booking</button>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.selectWrapper}>
          <Filter size={18} className={styles.filterIcon} />
          <select 
            className={styles.filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Reservation</th>
              <th>Guests</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(b => (
              <tr key={b.id} className={styles.row}>
                <td>
                  <div className={styles.customerBox}>
                    <span className={styles.customerName}>{b.name}</span>
                    <span className={styles.customerEmail}>{b.email}</span>
                  </div>
                </td>
                <td>
                  <span className={styles.resDate}>{b.date}</span>
                  <span className={styles.resTime}>{b.time}</span>
                </td>
                <td><span className={styles.peopleBadge}>{b.people} Pax</span></td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[b.status.toLowerCase()]}`}>
                    {b.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actionCell}>
                    {b.status === "Pending" ? (
                      <div className={styles.btnGroup}>
                        <button 
                          className={styles.iconBtnCheck} 
                          onClick={() => updateStatus(b, "Approved")}
                          disabled={updatingId === b.id}
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          className={styles.iconBtnClose} 
                          onClick={() => updateStatus(b, "Rejected")}
                          disabled={updatingId === b.id}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className={styles.sentLabel}>
                        <BellRing size={14} /> Sent
                      </div>
                    )}
                    <button className={styles.deleteBtn} onClick={() => deleteBooking(b.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}