"use client";
import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import TopBar from "@/app/landing/TopBar";
import styles from "./notifications.module.css";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    const user = JSON.parse(stored);
    const q = query(
      collection(db, "notifications"),
      where("userEmail", "==", user.email),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const loaded = snap.docs.map((d) => {
        const raw = d.data();
        const createdAt = raw.createdAt instanceof Timestamp
          ? raw.createdAt.toDate()
          : new Date();
        return { id: d.id, ...raw, createdAt };
      });

      setNotifications(loaded);

      snap.docs.forEach((d) => {
        const notification = d.data();
        if (notification.isRead === false) {
          updateDoc(doc(db, "notifications", d.id), { isRead: true }).catch(() => null);
        }
      });
    });

    return () => unsub();
  }, []);

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <TopBar />
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <div>
            <h1>Notifications</h1>
            <p>Reservation confirmations and updates from the restaurant.</p>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className={styles.emptyState}>
            No notifications yet. Reservation confirmation messages will appear here.
          </div>
        ) : (
          <div className={styles.notificationsList}>
            {notifications.map((notification) => (
              <div key={notification.id} className={styles.notificationCard}>
                <div className={styles.cardHeader}>
                  <div>
                    <h2>{notification.title}</h2>
                    <p className={styles.subText}>For reservation on {notification.message?.match(/Date: (.*)/)?.[1] || "your booking"}</p>
                  </div>
                  <span>{notification.createdAt.toLocaleString()}</span>
                </div>
                <p className={styles.cardMessage}>{notification.message}</p>
                <div className={styles.metaRow}>
                  <div className={`${styles.statusIndicator} ${notification.status === "Approved" ? styles.approved : notification.status === "Rejected" ? styles.rejected : styles.pending}`}>
                    {notification.status || notification.type}
                  </div>
                  <div className={styles.badge}>{notification.type}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
