"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  writeBatch
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import TopBar from "@/app/landing/TopBar";
import styles from "./profile.module.css";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Hourglass,
  XCircle,
  Trash2,
  Eraser,
  Edit,
  Save
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          router.push("/auth/login");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setName(parsedUser.name);
        setAvatar(localStorage.getItem("avatar"));

        const q = query(
          collection(db, "bookings"),
          where("email", "==", parsedUser.email)
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));

        // ✅ LAST BOOKING ON TOP (SAFE SORT)
        data.sort((a: any, b: any) =>
          (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );

        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  /* ---------------- ACTIONS ---------------- */

  const saveName = () => {
    const updatedUser = { ...user, name };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setEditName(false);
  };

  const uploadAvatar = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("avatar", reader.result as string);
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    await deleteDoc(doc(db, "bookings", id));
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const clearAllHistory = async () => {
    if (!confirm("Clear all booking history?")) return;
    const q = query(collection(db, "bookings"), where("email", "==", user.email));
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
    setBookings([]);
  };

  if (loading) return <div className={styles.loadingText}>Loading Profile...</div>;

  return (
    <div className={styles.pageContainer}>
      <TopBar />
      <div className={styles.contentWrapper}>

        {/* PROFILE HEADER */}
        <div className={styles.profileHeader}>
          <label className={styles.avatar}>
            <input type="file" hidden onChange={uploadAvatar} />
            {avatar ? <img src={avatar} /> : user.name[0]}
          </label>

          <div>
            {editName ? (
              <div className={styles.editName}>
                <input value={name} onChange={e => setName(e.target.value)} />
                <button onClick={saveName}><Save size={16} /></button>
              </div>
            ) : (
              <h2>
                {user.name}
                <Edit size={16} onClick={() => setEditName(true)} />
              </h2>
            )}
            <p>{user.email}</p>
          </div>
        </div>

        {/* HISTORY HEADER */}
        <div className={styles.historyHeader}>
          <h3>Your Reservation History</h3>
          {bookings.length > 0 && (
            <button onClick={clearAllHistory}>
              <Eraser size={14} /> Clear All
            </button>
          )}
        </div>

        {/* BOOKINGS */}
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map(b => (
            <div key={b.id} className={styles.bookingCard}>
              <div><Calendar size={16} /> {b.date}</div>
              <div><Clock size={16} /> {b.time}</div>
              <div><Users size={16} /> {b.people} Pax</div>

              <div className={
                b.status === "Pending"
                  ? styles.statusPending
                  : b.status === "Complete"
                  ? styles.statusComplete
                  : styles.statusRejected
              }>
                {b.status === "Pending" && <Hourglass size={14} />}
                {b.status === "Complete" && <CheckCircle2 size={14} />}
                {b.status === "Rejected" && <XCircle size={14} />}
                <span>{b.status}</span>
              </div>

              <button onClick={() => deleteBooking(b.id)} className={styles.deleteBtn}>
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}

      </div>
    </div>
  );
}
