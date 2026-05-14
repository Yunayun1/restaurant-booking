"use client";

import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CalendarCheck,
  MessageSquare,
  Shield,
  LogOut,
  TableProperties,
  UtensilsCrossed,
  ChevronRight,
} from "lucide-react";

import { useRouter, usePathname } from "next/navigation";
import styles from "./Admin.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Updated Menu: Removed 'desc' to clean up the UI
  const primaryMenu = [
    { name: "Live Bookings", icon: <LayoutDashboard size={22} />, path: "/admin/dashboard" },
    { name: "Manage Bookings", icon: <CalendarCheck size={22} />, path: "/admin/booking" },
    { name: "Guest Messages", icon: <MessageSquare size={22} />, path: "/admin/messages" },
    { name: "Reservations", icon: <CalendarCheck size={22} />, path: "/admin/reservation" },
    { name: "Tables", icon: <TableProperties size={22} />, path: "/admin/table" },
  ];

  const managementMenu = [
    { name: "Digital Menu", icon: <UtensilsCrossed size={22} />, path: "/admin/menu" },
    { name: "Manage Admins", icon: <Shield size={22} />, path: "/admin/manage" },
  ];

  const isLoginPage = pathname === "/admin";

  useEffect(() => {
    setMounted(true);
    const isAdmin = localStorage.getItem("admin");
    if (!isAdmin && !isLoginPage) {
      router.push("/admin");
    }
  }, [isLoginPage, router]);

  if (!mounted) return null;

  if (isLoginPage) return <>{children}</>;

  return (
    <div className={styles.adminWrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.logoIcon}>
            <UtensilsCrossed size={20} />
          </div>
          <h2 className={styles.brandTitle}>Admin<span>Panel</span></h2>
        </div>

        <div className={styles.navContainer}>
          <p className={styles.sectionLabel}>Operations</p>
          <nav className={styles.nav}>
            {primaryMenu.map((item) => (
              <div
                key={item.path}
                className={`${styles.navItem} ${pathname === item.path ? styles.active : ""}`}
                onClick={() => router.push(item.path)}
              >
                <div className={styles.iconBox}>{item.icon}</div>
                <div className={styles.navText}>
                  <span className={styles.navName}>{item.name}</span>
                </div>
                {pathname === item.path && <ChevronRight size={16} className={styles.arrow} />}
              </div>
            ))}
          </nav>

          <p className={`${styles.sectionLabel} ${styles.mt}`}>System Management</p>
          <nav className={styles.nav}>
            {managementMenu.map((item) => (
              <div
                key={item.path}
                className={`${styles.navItem} ${pathname === item.path ? styles.active : ""}`}
                onClick={() => router.push(item.path)}
              >
                <div className={styles.iconBox}>{item.icon}</div>
                <div className={styles.navText}>
                  <span className={styles.navName}>{item.name}</span>
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.sidebarFooter}>
          <button
            className={styles.logoutBtn}
            onClick={() => {
              localStorage.removeItem("admin");
              router.push("/admin");
            }}
          >
            <LogOut size={18} />
            Logout Session
          </button>
        </div>
      </aside>

      <main className={styles.mainArea}>
        <header className={styles.topNav}>
          <div className={styles.pageTitleContext}>
            <p>Portal / <strong>{primaryMenu.find(m => m.path === pathname)?.name || "Management"}</strong></p>
          </div>
          <div className={styles.adminProfile}>
            <div className={styles.avatar}>A</div>
            <span className={styles.badge}>Master Admin</span>
          </div>
        </header>
        
        <section className={styles.contentScroll}>
          {children}
        </section>
      </main>
    </div>
  );
}