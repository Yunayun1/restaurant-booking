"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Mail, Bell, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const primaryAccent = "#ffb400";
  const darkText = "#1a1a1a";
  const glassBG = "rgba(255, 255, 255, 0.9)";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let currentUserEmail = "";

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        currentUserEmail = parsed.email;
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }

    if (currentUserEmail) {
      // UPDATED QUERY: 
      // Listen ONLY for messages where isAdmin is true (Admin replies) 
      // and read is false.
      const q = query(
        collection(db, "messages"),
        where("email", "==", currentUserEmail),
        where("isAdmin", "==", true),
        where("read", "==", false)
      );

      const unsub = onSnapshot(q, (snap) => {
        setUnreadMessages(snap.size);

        snap.docChanges().forEach((change) => {
          // added type AND !hasPendingWrites ensures it only triggers 
          // for data coming from the SERVER (the Admin), not the local user.
          if (change.type === "added" && !snap.metadata.hasPendingWrites) {
            const data = change.doc.data();
            setToastText(data.content || "New message from Support!");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
          }
        });
      });

      return () => unsub();
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    router.push("/landing");
  };

  return (
    <nav style={navStyles.container(glassBG)}>
      <div style={navStyles.logo(darkText)} onClick={() => router.push("/landing")}>
        MY<span style={{ color: primaryAccent }}>RESTAURANT</span>
      </div>

      <div style={{ display: "flex", gap: "35px", alignItems: "center" }}>
        {["Home", "Menu", "About Us", "Contact"].map((label) => {
          const pathMap: Record<string, string> = {
            Home: "/landing", Menu: "/menu", "About Us": "/aboutus", Contact: "/contact",
          };
          const path = pathMap[label];
          const isActive = pathname === path;
          return (
            <div 
              key={label} 
              style={navStyles.navLink(isActive, isHovered === label, darkText)}
              onMouseEnter={() => setIsHovered(label)}
              onMouseLeave={() => setIsHovered(null)}
              onClick={() => router.push(path)}
            >
              <span>{label}</span>
              {isActive && <div style={navStyles.activeDot(primaryAccent)} />}
            </div>
          );
        })}

        {!user ? (
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <button onClick={() => router.push("/auth/login")} style={loginButtonStyle}>Login</button>
            <button onClick={() => router.push("/auth/register")} style={navStyles.signUpBtn(primaryAccent, darkText)}>Sign Up</button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            
            <div 
              style={navStyles.iconWrapper} 
              onClick={() => router.push("/messages")}
              title="Inbox"
            >
              <Mail size={22} color={darkText} strokeWidth={2} />
              {unreadMessages > 0 && (
                <div style={navStyles.notificationBadge}>{unreadMessages}</div>
              )}
            </div>

            <div ref={dropdownRef} style={{ position: "relative" }}>
              <div onClick={() => setShowDropdown(!showDropdown)} style={avatarStyle(primaryAccent, darkText)}>
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              {/* Inside the Dropdown Menu in TopBar.tsx */}
{showDropdown && (
  <div style={dropdownContainerStyle}>
    <div style={dropdownHeaderStyle}>
      <p style={{ margin: 0, fontSize: "0.7rem", color: "#888", fontWeight: 600 }}>SIGNED IN AS</p>
      <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: "800", color: darkText }}>{user?.name}</p>
    </div>
    
    {/* NEW PROFILE BUTTON */}
    <button onClick={() => { router.push("/profile"); setShowDropdown(false); }} style={dropdownButtonStyle}>
      <User size={16} /> My Profile
    </button>


    
    <button onClick={() => router.push("/profile/settings")} style={dropdownButtonStyle}>
      <Settings size={16} /> Settings
    </button>
    
    <div style={{ borderTop: "1px solid #f0f0f0", margin: "5px 0" }} />
    <button onClick={handleLogout} style={{ ...dropdownButtonStyle, color: "#ef4444" }}>
      <LogOut size={16} /> Sign Out
    </button>
  </div>
)}
            </div>
          </div>
        )}
      </div>

      {showToast && (
        <div style={toastStyle}>
           <Bell size={18} />
           <span>{toastText}</span>
        </div>
      )}
    </nav>
  );
}

// --- STYLES ---

const toastStyle: React.CSSProperties = {
  position: "fixed",
  bottom: "30px",
  right: "30px",
  backgroundColor: "#1a1a1a",
  color: "#fff",
  padding: "14px 24px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  fontSize: "0.9rem",
  fontWeight: "600",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  zIndex: 9999,
};

const loginButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  fontWeight: "700",
  cursor: "pointer",
  color: "#1a1a1a",
  fontSize: "0.9rem",
};

const avatarStyle = (bg: string, color: string): React.CSSProperties => ({
  width: "42px", height: "42px", borderRadius: "12px",
  backgroundColor: bg, color: color,
  display: "flex", alignItems: "center", justifyContent: "center",
  fontWeight: "800", cursor: "pointer",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
});

const dropdownContainerStyle: React.CSSProperties = {
  position: "absolute", right: 0, top: "55px",
  backgroundColor: "#fff", minWidth: "220px", borderRadius: "16px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.15)", padding: "10px",
  border: "1px solid #f0f0f0", zIndex: 1100,
};

const dropdownHeaderStyle: React.CSSProperties = {
  padding: "12px 15px", borderBottom: "1px solid #f8f8f8", marginBottom: "8px",
};

const dropdownButtonStyle: React.CSSProperties = {
  width: "100%", padding: "12px 15px", textAlign: "left",
  background: "transparent", border: "none", borderRadius: "10px",
  cursor: "pointer", fontSize: "0.85rem", fontWeight: "600",
  color: "#444", display: "flex", alignItems: "center", gap: "10px",
};

const navStyles = {
  container: (bg: string): React.CSSProperties => ({
    width: "100%", padding: "15px 60px", display: "flex",
    justifyContent: "space-between", alignItems: "center",
    backgroundColor: bg, backdropFilter: "blur(12px)",
    position: "sticky", top: 0, zIndex: 1000,
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  }),
  logo: (color: string): React.CSSProperties => ({
    fontWeight: "900", fontSize: "1.4rem", cursor: "pointer",
    color: color, letterSpacing: "-0.8px",
  }),
  navLink: (isActive: boolean, beingHovered: boolean, darkText: string): React.CSSProperties => ({
    cursor: "pointer", color: isActive ? darkText : "#666",
    fontWeight: isActive ? "800" : "500", fontSize: "0.9rem",
    position: "relative",
  }),
  activeDot: (color: string): React.CSSProperties => ({
    width: "18px", height: "3px", backgroundColor: color,
    borderRadius: "10px", position: "absolute", bottom: "-8px",
    left: "50%", transform: "translateX(-50%)",
  }),
  signUpBtn: (bg: string, text: string): React.CSSProperties => ({
    backgroundColor: bg, padding: "10px 22px", borderRadius: "12px",
    border: "none", fontSize: "0.85rem", fontWeight: "800",
    cursor: "pointer", color: text,
    boxShadow: "0 4px 15px rgba(255, 180, 0, 0.3)",
  }),
  iconWrapper: {
    position: "relative" as const, cursor: "pointer",
    padding: "8px", borderRadius: "10px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  notificationBadge: {
    position: "absolute" as const, top: "2px", right: "2px",
    backgroundColor: "#ef4444", color: "white",
    fontSize: "10px", fontWeight: "bold", borderRadius: "50%",
    width: "18px", height: "18px", display: "flex",
    alignItems: "center", justifyContent: "center", border: "2px solid white",
  }
};