"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "./table.module.css";
import { Trash2, Edit2, Check } from "lucide-react";

interface Table {
  id?: string;
  number: number;
  customerName: string;
  capacity: number;
  floor: string;
  date: string;
  time: string;
  status: "Available" | "Booked" | "Arrived" | "Complete";
}

const FLOORS = ["All", "Ground", "First", "Second", "Third"];
const STATUS = ["Available", "Booked", "Arrived", "Complete"];

export default function TableManagement() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [floorFilter, setFloorFilter] = useState("All");

  // Form states
  const [number, setNumber] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [floor, setFloor] = useState("Ground");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch tables
  const fetchTables = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "tables"));
    const data: Table[] = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as Table) }));
    setTables(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // Add or update table
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !floor || !capacity || !number || !date || !time) return;

    if (editingId) {
      // Update existing table
      await updateDoc(doc(db, "tables", editingId), { number, customerName, floor, capacity, date, time });
      setEditingId(null);
    } else {
      // Add new table
      await addDoc(collection(db, "tables"), { number, customerName, floor, capacity, date, time, status: "Available" });
    }

    setNumber(1);
    setCustomerName("");
    setFloor("Ground");
    setCapacity(2);
    setDate("");
    setTime("");
    fetchTables();
  };

  // Delete table
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this table?")) {
      await deleteDoc(doc(db, "tables", id));
      fetchTables();
    }
  };

  // Edit table
  const handleEdit = (table: Table) => {
    setNumber(table.number);
    setCustomerName(table.customerName);
    setFloor(table.floor);
    setCapacity(table.capacity);
    setDate(table.date);
    setTime(table.time);
    setEditingId(table.id || null);
  };

  // Change status
  const handleStatusChange = async (id: string, status: Table["status"]) => {
    await updateDoc(doc(db, "tables", id), { status });
    fetchTables();
  };

  // Filter tables by floor
  const filteredTables = tables.filter(t => floorFilter === "All" || t.floor === floorFilter);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Table Management</h1>
      <p className={styles.subtitle}>Manage tables across all floors</p>

      {/* Add / Edit Table Form */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Table Number"
          value={number}
          min={1}
          onChange={(e) => setNumber(Number(e.target.value))}
          required
        />
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Capacity"
          value={capacity}
          min={1}
          max={20}
          onChange={(e) => setCapacity(Number(e.target.value))}
          required
        />
        <select value={floor} onChange={(e) => setFloor(e.target.value)}>
          {FLOORS.slice(1).map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <button type="submit">{editingId ? "Update Table" : "Add Table"} {editingId && <Check size={16} />}</button>
      </form>

      {/* Floor Filter */}
      <div className={styles.filter}>
        <span>Filter by Floor:</span>
        <select value={floorFilter} onChange={(e) => setFloorFilter(e.target.value)}>
          {FLOORS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Table Grid */}
      {loading ? (
        <p>Loading tables...</p>
      ) : filteredTables.length === 0 ? (
        <p>No tables found.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Number</th>
                <th>Customer Name</th>
                <th>Capacity</th>
                <th>Floor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTables.map(table => (
                <tr key={table.id}>
                  <td>{table.number}</td>
                  <td>{table.customerName}</td>
                  <td>{table.capacity}</td>
                  <td>{table.floor}</td>
                  <td>{table.date}</td>
                  <td>{table.time}</td>
                  <td>
                    <select
                      value={table.status}
                      onChange={(e) => handleStatusChange(table.id!, e.target.value as Table["status"])}
                    >
                      {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className={styles.actions}>
                    <button onClick={() => handleEdit(table)}><Edit2 size={16} /> Edit</button>
                    <button onClick={() => handleDelete(table.id!)} className={styles.delete}><Trash2 size={16} /> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
