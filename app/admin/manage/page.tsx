"use client";

import React, { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { db, auth } from "@/firebase";

import styles from "./manageAdmin.module.css";

import {
  Trash2,
  UserPlus,
  Search,
  Loader2,
} from "lucide-react";

interface Admin {
  id: string;
  email: string;
  role: string;
  createdAt?: string;
}

export default function ManageAdminPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");

  const [filter, setFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Fetch Admins
  const fetchAdmins = async () => {
    setLoading(true);

    try {
      const q = query(collection(db, "admins"));

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((d) => ({
        id: d.id,
        email: d.data().email || "",
        role: d.data().role || "admin",
        createdAt: d.data().createdAt || "",
      }));

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

  // Add Admin
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setAdding(true);

    try {
      // Duplicate Check
      const duplicate = admins.find(
        (a) => a.email.toLowerCase() === email.toLowerCase()
      );

      if (duplicate) {
        alert("Admin already exists");
        return;
      }

      // Create Firebase Auth User
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Save Admin to Firestore
      await addDoc(collection(db, "admins"), {
        uid: userCredential.user.uid,
        email: email.toLowerCase(),
        role,
        createdAt: new Date().toISOString(),
      });

      alert("Admin created successfully");

      setEmail("");
      setPassword("");
      setRole("admin");

      fetchAdmins();
    } catch (err: any) {
      console.error(err);

      if (err.code === "auth/email-already-in-use") {
        alert("Email already in use");
      } else if (err.code === "auth/weak-password") {
        alert("Password must be at least 6 characters");
      } else {
        alert("Failed to create admin");
      }
    } finally {
      setAdding(false);
    }
  };

  // Delete Admin
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to remove this admin?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "admins", id));

      setAdmins((prev) =>
        prev.filter((admin) => admin.id !== id)
      );

      alert("Admin removed");
    } catch (err) {
      console.error("Error deleting admin:", err);
    }
  };

  // Filter Admins
  const filteredAdmins = admins.filter((a) => {
    const adminEmail = a?.email?.toLowerCase() ?? "";
    const searchString = filter?.toLowerCase() ?? "";

    return adminEmail.includes(searchString);
  });

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>Manage Admins</h1>

        <p className={styles.subtitle}>
          Control who has access to this portal.
        </p>
      </div>

      <div className={styles.topActions}>
        {/* Add Admin Form */}
        <form
          onSubmit={handleAddAdmin}
          className={styles.form}
        >
          <div className={styles.inputGroup}>
            {/* Email */}
            <input
              type="email"
              placeholder="Enter admin email"
              className={styles.formInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Enter password"
              className={styles.formInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Role */}
            <select
              className={styles.formInput}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>

              <option value="superadmin">
                Super Admin
              </option>
            </select>

            {/* Add Button */}
            <button
              type="submit"
              className={styles.addBtn}
              disabled={adding}
            >
              {adding ? (
                <Loader2
                  className={styles.spin}
                  size={18}
                />
              ) : (
                <UserPlus size={18} />
              )}

              <span>
                {adding ? "Adding..." : "Add Admin"}
              </span>
            </button>
          </div>
        </form>

        {/* Search */}
        <div className={styles.searchBox}>
          <Search
            className={styles.searchIcon}
            size={18}
          />

          <input
            type="text"
            placeholder="Search admins..."
            className={styles.filterInput}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Admin Email</th>
              <th>Role</th>
              <th>Date Created</th>
              <th style={{ textAlign: "right" }}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className={styles.emptyState}
                >
                  <Loader2 className={styles.spin} />

                  <p>Fetching admin database...</p>
                </td>
              </tr>
            ) : filteredAdmins.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className={styles.emptyState}
                >
                  <p>
                    No admins found matching "{filter}"
                  </p>
                </td>
              </tr>
            ) : (
              filteredAdmins.map((admin) => (
                <tr key={admin.id}>
                  <td className={styles.emailCell}>
                    {admin.email}
                  </td>

                  <td>{admin.role}</td>

                  <td>
                    {admin.createdAt
                      ? new Date(
                          admin.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className={styles.actions}>
                    <button
                      className={styles.deleteBtn}
                      onClick={() =>
                        handleDelete(admin.id)
                      }
                    >
                      <Trash2 size={16} />

                      <span>Remove</span>
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