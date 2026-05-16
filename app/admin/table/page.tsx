"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "./table.module.css";

interface Table {
  id?: string;
  tableCode?: string;
  number?: number;
  customerName: string;
  capacity: number;
  floor: string;
  date: string;
  time: string;
  status: "Available" | "Booked" | "Arrived" | "Complete";
  createdAt?: any;
}

const FLOORS = ["All", "First", "Second"];
const STATUS = ["Available", "Booked", "Arrived", "Complete"];
const OPENING_HOUR = 10;
const CLOSING_HOUR = 22;
const SLOT_LIMIT = 47;

const TABLE_INVENTORY = [
  { code: "TB-01", capacity: 2, floor: "First" },
  { code: "TB-02", capacity: 2, floor: "First" },
  { code: "TB-03", capacity: 2, floor: "First" },
  { code: "TB-04", capacity: 4, floor: "First" },
  { code: "TB-05", capacity: 4, floor: "First" },
  { code: "TB-06", capacity: 4, floor: "First" },
  { code: "TB-07", capacity: 4, floor: "Second" },
  { code: "TB-08", capacity: 4, floor: "Second" },
  { code: "TB-09", capacity: 4, floor: "Second" },
  { code: "TB-10", capacity: 6, floor: "Second" },
  { code: "TB-11", capacity: 6, floor: "Second" },
  { code: "TB-12", capacity: 5, floor: "Second" },
];

const formatSlotLabel = (hour: number) => {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const buildTimelineSlots = () => {
  const slots: { key: string; label: string }[] = [];
  for (let hour = OPENING_HOUR; hour <= CLOSING_HOUR; hour++) {
    slots.push({ key: `${hour.toString().padStart(2, '0')}:00`, label: formatSlotLabel(hour) });
  }
  return slots;
};

export default function TableManagement() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [floorFilter, setFloorFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"floor" | "timeline">("floor");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedTime, setSelectedTime] = useState("11:00");
  const [peopleCount, setPeopleCount] = useState(1);

  // Form states for creating new table
  const [tableCode, setTableCode] = useState("TB-01");
  const [customerName, setCustomerName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [floor, setFloor] = useState("First");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("11:00");

  // Fetch tables
  const fetchTables = async () => {
    setLoading(true);
    const tablesQuery = query(collection(db, "tables"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(tablesQuery);
    const data: Table[] = snapshot.docs
      .map(d => ({ id: d.id, ...(d.data() as Table) }))
      .sort((a, b) => {
        const aTime = typeof a.createdAt?.toMillis === "function" ? a.createdAt.toMillis() : a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = typeof b.createdAt?.toMillis === "function" ? b.createdAt.toMillis() : b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
    setTables(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // Add new reservation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !floor || !capacity || !tableCode || !date || !time) return;

    const partySize = parseInt(capacity, 10);
    if (Number.isNaN(partySize) || partySize <= 0) return;

    const tableConfig = TABLE_INVENTORY.find((entry) => entry.code === tableCode);
    if (!tableConfig) return;
    if (partySize > tableConfig.capacity) {
      alert(`Selected table ${tableCode} seats ${tableConfig.capacity}. Please choose a smaller party or a larger table.`);
      return;
    }

    const conflict = tables.some((t) => {
      const code = t.tableCode ?? (t.number ? `TB-${String(t.number).padStart(2, '0')}` : "");
      return code === tableCode && t.date === date && t.time === time;
    });
    if (conflict) {
      alert(`Table ${tableCode} is already booked at ${time} on ${date}. Please choose another table or time.`);
      return;
    }

    try {
      const tableDoc = await addDoc(collection(db, "tables"), { 
        tableCode,
        customerName, 
        floor, 
        capacity: partySize, 
        date, 
        time, 
        status: "Booked",
        createdAt: serverTimestamp(),
      });

      const localCreatedAt = new Date();
      setTables((prev) => [
        {
          id: tableDoc.id,
          tableCode,
          customerName,
          floor,
          capacity: partySize,
          date,
          time,
          status: "Booked",
          createdAt: localCreatedAt,
        },
        ...prev,
      ]);

      setTableCode("TB-01");
      setCustomerName("");
      setFloor("First");
      setCapacity("");
      setDate("");
      setTime("11:00");
      fetchTables();
    } catch (error) {
      console.error("Error adding reservation:", error);
    }
  };

  // Count bookings by date
  const countBookingsByDate = (targetDate: string) => {
    return tables.filter(t => t.date === targetDate).length;
  };

  // Get today and tomorrow dates
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const todayCount = countBookingsByDate(today);
  const tomorrowCount = countBookingsByDate(tomorrow);
  const allCount = tables.length;

  // Delete table
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this table?")) {
      await deleteDoc(doc(db, "tables", id));
      fetchTables();
    }
  };

  // Edit reservation
  const handleEdit = (table: Table) => {
    setTableCode(table.tableCode ?? (table.number ? `TB-${String(table.number).padStart(2, '0')}` : "TB-01"));
    setCustomerName(table.customerName);
    setFloor(table.floor);
    setCapacity(String(table.capacity));
    setDate(table.date);
    setTime(table.time);
  };

  // Change status
  const handleStatusChange = async (id: string, status: Table["status"]) => {
    await updateDoc(doc(db, "tables", id), { status });
    fetchTables();
  };

  const getTableCode = (table: Table) => table.tableCode ?? (table.number ? `TB-${String(table.number).padStart(2, '0')}` : "TB-00");

  // Filter tables by floor
  const filteredTables = tables.filter(t => floorFilter === "All" || t.floor === floorFilter);

  const floorPlanTables = filteredTables
    .slice()
    .sort((a, b) => {
      const aTime = typeof a.createdAt?.toMillis === "function" ? a.createdAt.toMillis() : a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = typeof b.createdAt?.toMillis === "function" ? b.createdAt.toMillis() : b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (bTime !== aTime) return bTime - aTime;
      return getTableCode(a).localeCompare(getTableCode(b));
    });

  const inventoryForFilter = floorFilter === "All"
    ? TABLE_INVENTORY
    : TABLE_INVENTORY.filter((item) => item.floor === floorFilter);

  const occupiedTableCodes = tables
    .filter((table) => table.date === selectedDate && table.time === selectedTime)
    .map((table) => getTableCode(table));

  const availableTables = inventoryForFilter.filter(
    (item) => !occupiedTableCodes.includes(item.code) && item.capacity >= peopleCount
  );
  const availableTableCodes = availableTables.map((item) => item.code);
  const availableTableText = availableTableCodes.length > 0 ? availableTableCodes.join(", ") : "None";

  const timelineSlots = buildTimelineSlots().map((slot) => {
    const reservationsForSlot = filteredTables.filter((table) => {
      return table.date === selectedDate && table.time === slot.key;
    });

    const covers = reservationsForSlot.reduce((sum, table) => sum + table.capacity, 0);
    return {
      ...slot,
      limit: Math.max(0, SLOT_LIMIT - covers),
      covers,
      reservations: reservationsForSlot.map((table) => `${table.customerName}(${table.capacity})`),
    };
  });

  const now = new Date();
  const upcomingTables = filteredTables
    .filter((table) => {
      const tableDate = new Date(`${table.date}T${table.time}`);
      return tableDate >= now;
    })
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  return (
    <div className={styles.container}>
      <header className={styles.headerCard}>
        <div>
          <h1 className={styles.title}>Table Reservation Dashboard</h1>
        </div>
        <div className={styles.statsCard}>
          <div>
            <p className={styles.statLabel}>All</p>
            <strong>{allCount}</strong>
          </div>
          <div>
            <p className={styles.statLabel}>Today</p>
            <strong>{todayCount}</strong>
          </div>
          <div>
            <p className={styles.statLabel}>Tomorrow</p>
            <strong>{tomorrowCount}</strong>
          </div>
        </div>
      </header>

      {/* Create New Reservation Form */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <h3 className={styles.formTitle}>Create New Table</h3>
        <div className={styles.formGrid}>
          <select value={tableCode} onChange={(e) => setTableCode(e.target.value)} required>
            {TABLE_INVENTORY.map((item) => (
              <option key={item.code} value={item.code}>{item.code} · {item.capacity} seats</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Guest Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Guests"
            value={capacity}
            min="1"
            max="20"
            onChange={(e) => setCapacity(e.target.value)}
            required
          />
          <select
            value={floor}
            onChange={(e) => {
              setFloor(e.target.value);
              const firstTable = TABLE_INVENTORY.find((item) => item.floor === e.target.value);
              if (firstTable) setTableCode(firstTable.code);
            }}
            required
          >
            <option value="First">First Floor</option>
            <option value="Second">Second Floor</option>
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
          <button type="submit" className={styles.submitButton}>Create Table</button>
        </div>
      </form>

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === "floor" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("floor")}
        >
          Floor Plan
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === "timeline" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("timeline")}
        >
          Timeline
        </button>
      </div>

      {/* Floor Filter */}
      <div className={styles.filter}>
        <span>Filter by Floor:</span>
        <select value={floorFilter} onChange={(e) => setFloorFilter(e.target.value)}>
          {FLOORS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <span>Filter by Date:</span>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </div>

      <div className={styles.panelGrid}>
        <main className={styles.mainPanel}>
          {activeTab === "floor" ? (
            <>
              <div className={styles.searchCard}>
                <div className={styles.searchRow}>
                  <label>
                    Date
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </label>
                  <label>
                    Time
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    />
                  </label>
                  <label className={styles.peopleControl}>
                    People
                    <div className={styles.peopleInput}>
                      <button type="button" onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}>-</button>
                      <span>{peopleCount}</span>
                      <button type="button" onClick={() => setPeopleCount(peopleCount + 1)}>+</button>
                    </div>
                  </label>
                </div>
                <button type="button" className={styles.primaryButton}>Check Availability</button>
              </div>

              <div className={styles.floorSummary}>
                <p>Available tables for {peopleCount} person(s) on {selectedDate} at {selectedTime}.</p>
                <p className={styles.availabilityList}>{availableTableText}</p>
                <span>Click any table to book it.</span>
              </div>

              <div className={styles.floorGrid}>
                {loading ? (
                  <div className={styles.emptyState}>Loading tables...</div>
                ) : floorPlanTables.length === 0 ? (
                  <div className={styles.emptyState}>No tables available for this floor.</div>
                ) : (
                  floorPlanTables.map((table) => (
                    <div key={table.id} className={`${styles.tableCard} ${styles[table.status.toLowerCase()]}`}>
                      <span className={styles.tableNumber}>{getTableCode(table)}</span>
                      <span className={styles.tableLabel}>{table.capacity} seats</span>
                      <span className={styles.tableMeta}>{table.date} · {table.time}</span>
                      <span className={styles.tableCustomer}>{table.customerName}</span>
                      <span className={styles.statusPill}>{table.status}</span>
                      <button 
                        type="button"
                        onClick={() => handleDelete(table.id!)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <section className={styles.timelineCard}>
              <div className={styles.timelineHeader}>
                <div>
                  <p className={styles.contextLabel}>Times</p>
                  <h2>Reservation timeline</h2>
                </div>
                <button type="button" className={styles.primaryButton}>New Reservation</button>
              </div>
              <div className={styles.timelineTableWrapper}>
                <table className={styles.timelineTable}>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Limit</th>
                      <th>Covers</th>
                      <th>Reservations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timelineSlots.map((slot) => (
                      <tr key={slot.key}>
                        <td>{slot.label}</td>
                        <td>{slot.limit}</td>
                        <td>{slot.covers}</td>
                        <td>{slot.reservations.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>

        <aside className={styles.sidePanel}>
          <div className={styles.upcomingCard}>
            <div className={styles.upcomingHeader}>
              <p className={styles.contextLabel}>Upcoming</p>
            </div>
            <div className={styles.upcomingList}>
              {loading ? (
                <div className={styles.emptyState}>Loading...</div>
              ) : upcomingTables.length === 0 ? (
                <div className={styles.emptyState}>No upcoming reservations</div>
              ) : (
                upcomingTables.slice(0, 5).map((item) => (
                  <div key={item.id} className={styles.upcomingItem}>
                    <div>
                      <p className={styles.upcomingTime}>{item.date} {item.time}</p>
                      <p className={styles.upcomingName}>{item.customerName}</p>
                    </div>
                    <div className={styles.upcomingMeta}>{getTableCode(item)} · {item.capacity} guests</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
