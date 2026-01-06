"use client";
import React from "react";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Settings2, 
  TableProperties, 
  UtensilsCrossed, 
  MessageSquareHeart, 
  MessageSquare, // Added for Guest Messages
  History, 
  LogOut, 
  ShieldCheck ,
  Shield
} from "lucide-react";
import styles from "./Admin.module.css";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Categorized Menu Items
  const primaryMenu = [
    { name: "Live Bookings", icon: <LayoutDashboard size={20} />, path: "/admin/dashboard", desc: "Overview" },
    { name: "Manage Bookings", icon: <CalendarCheck size={20} />, path: "/admin/booking", desc: "Approve / Reject" },
    { 
      name: "Guest Messages", 
      icon: <MessageSquare size={20} />, 
      path: "/admin/messages", 
      desc: "Customer Chat" 
    },
    { name: "Reservations", icon: <CalendarCheck size={20} />, path: "/admin/reservations", desc: "Edit / Cancel" },
    { name: "Tables", icon: <TableProperties size={20} />, path: "/admin/table", desc: "Availability" },
  ];

  const managementMenu = [
    { name: "Digital Menu", icon: <UtensilsCrossed size={20} />, path: "/admin/menu" },
    { name: "Feedback", icon: <MessageSquareHeart size={20} />, path: "/admin/feedback" },
    { name: "Analytics", icon: <History size={20} />, path: "/admin/history" },
    { name: "Manage Admins", icon: <Shield size={20} />, path: "/admin/manage" },
  ];

  return (
    <div className={styles.adminWrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.logoIcon}><ShieldCheck size={24} /></div>
          <h2>Booking<span>Res</span></h2>
        </div>

        <nav className={styles.nav}>
          {/* Section 1: Operations */}
          <p className={styles.sectionLabel}>Operations</p>
          {primaryMenu.map((item) => (
            <div 
              key={item.name}
              className={`${styles.navItem} ${pathname === item.path ? styles.active : ""}`}
              onClick={() => router.push(item.path)}
            >
              {item.icon}
              <div className={styles.navText}>
                <span className={styles.navName}>{item.name}</span>
              </div>
            </div>
          ))}

          {/* Section 2: Management */}
          <p className={styles.sectionLabel} style={{marginTop: '30px'}}>Management</p>
          {managementMenu.map((item) => (
            <div 
              key={item.name}
              className={`${styles.navItem} ${pathname === item.path ? styles.active : ""}`}
              onClick={() => router.push(item.path)}
            >
              {item.icon}
              <span className={styles.navName}>{item.name}</span>
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={() => router.push("/")}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className={styles.mainArea}>
        <header className={styles.topNav}>
          <div className={styles.pageTitleContext}>
             <p>Organization / <strong>Admin Dashboard</strong></p>
          </div>
          <div className={styles.adminProfile}>
            <div className={styles.badge}>PRO PLAN</div>
            <div className={styles.avatar}>A</div>
          </div>
        </header>
        <div className={styles.contentScroll}>
          {children}
        </div>
      </main>
    </div>
  );
}