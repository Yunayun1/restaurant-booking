"use client";

import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "./manageAdmin.module.css";
import { Trash2 } from "lucide-react";

interface Admin {
  id: string;
  email: string;
}

export default function ManageAdminPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [email, setEmail] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Fetch admins from Firestore
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "admins"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, email: d.data().email }));
      setAdmins(data);
    } catch (err) {
      console.error("Error fetching admins:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Add new admin
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setAdding(true);
    try {
      // Check for duplicate
      const duplicate = admins.find(a => a.email === email);
      if (duplicate) {
        alert("This admin already exists.");
        setAdding(false);
        return;
      }

      await addDoc(collection(db, "admins"), { email });
      setEmail("");
      fetchAdmins();
    } catch (err) {
      console.error("Error adding admin:", err);
    } finally {
      setAdding(false);
    }
  };

  // Delete admin
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this admin?")) return;

    try {
      await deleteDoc(doc(db, "admins", id));
      fetchAdmins();
    } catch (err) {
      console.error("Error deleting admin:", err);
    }
  };

  // Filtered admins
  const filteredAdmins = admins.filter(a => a.email.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Admins</h1>
      <p className={styles.subtitle}>Add, view, and remove admin accounts.</p>

      {/* Add Admin Form */}
      <form onSubmit={handleAddAdmin} className={styles.form}>
        <input
          type="email"
          placeholder="Admin email"
          className={styles.formInput}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={adding}>
          {adding ? "Adding..." : "Add Admin"}
        </button>
      </form>

      {/* Search/Filter */}
      <div className={styles.filter}>
        <input
          type="text"
          placeholder="Search admins by email..."
          className={styles.filterInput}
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>

      {/* Admin Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2} style={{ textAlign: "center", padding: "20px" }}>
                  Loading admins...
                </td>
              </tr>
            ) : filteredAdmins.length === 0 ? (
              <tr>
                <td colSpan={2} style={{ textAlign: "center", padding: "20px" }}>
                  No admins found.
                </td>
              </tr>
            ) : (
              filteredAdmins.map(admin => (
                <tr key={admin.id}>
                  <td>{admin.email}</td>
                  <td className={styles.actions}>
                    <button className={styles.delete} onClick={() => handleDelete(admin.id)}>
                      <Trash2 size={18} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
