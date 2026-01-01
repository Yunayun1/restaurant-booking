"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname();

  // State
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Design Constants
  const primaryAccent = "#ffb400";
  const darkText = "#1a1a1a";

  // Styles Object
  const navStyles = {
    container: {
      width: "100%",
      padding: "15px 60px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      position: "sticky" as const,
      top: 0,
      zIndex: 1000,
      boxShadow: "0 2px 15px rgba(0,0,0,0.05)",
      fontFamily: "'Inter', sans-serif",
    },
    logo: {
      fontWeight: "900",
      fontSize: "1.4rem",
      cursor: "pointer",
      color: darkText,
      letterSpacing: "-0.5px",
    },
    navLink: (isActive: boolean, beingHovered: boolean) => ({
      cursor: "pointer",
      color: isActive ? darkText : "#666",
      fontWeight: isActive ? "700" : "500",
      fontSize: "0.95rem",
      position: "relative" as const,
      transition: "all 0.2s ease",
      transform: beingHovered ? "translateY(-1px)" : "none",
    }),
    activeDot: {
      width: "18px",
      height: "3px",
      backgroundColor: primaryAccent,
      borderRadius: "10px",
      position: "absolute" as const,
      bottom: "-8px",
      left: "50%",
      transform: "translateX(-50%)",
    },
    signUpBtn: {
      backgroundColor: primaryAccent,
      padding: "10px 22px",
      borderRadius: "8px",
      border: "none",
      fontSize: "0.9rem",
      fontWeight: "700",
      cursor: "pointer",
      color: darkText,
      boxShadow: "0 4px 12px rgba(255, 180, 0, 0.3)",
      transition: "transform 0.2s ease",
    } as React.CSSProperties,
  };

  // Logic: Handle User and Clicks
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
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
    <nav style={navStyles.container}>
      {/* LOGO */}
      <div 
        style={navStyles.logo} 
        onClick={() => router.push("/landing")}
      >
        MY<span style={{ color: primaryAccent }}>RESTAURANT</span>
      </div>

      {/* NAVIGATION LINKS */}
      <div style={{ display: "flex", gap: "35px", alignItems: "center" }}>
        {["Home", "Menu", "About Us", "Contact"].map((label) => {
          const pathMap: Record<string, string> = {
            Home: "/landing",
            Menu: "/menu",
            "About Us": "/aboutus",
            Contact: "/contact",
          };

          const path = pathMap[label];
          const isActive = pathname === path;
          const beingHovered = isHovered === label;

          return (
            <div 
              key={label} 
              style={navStyles.navLink(isActive, beingHovered)}
              onMouseEnter={() => setIsHovered(label)}
              onMouseLeave={() => setIsHovered(null)}
              onClick={() => router.push(path)}
            >
              <span>{label}</span>
              {isActive && <div style={navStyles.activeDot} />}
            </div>
          );
        })}

        {/* AUTH SECTION */}
        {!user ? (
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <button 
              onClick={() => router.push("/auth/login")} 
              style={loginButtonStyle}
            >
              Login
            </button>
            <button 
              onClick={() => router.push("/auth/register")} 
              style={navStyles.signUpBtn}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              style={avatarStyle(primaryAccent, darkText)}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {showDropdown && (
              <div style={dropdownContainerStyle}>
                <div style={dropdownHeaderStyle}>
                  <div style={{ fontSize: "0.75rem", color: "#888", marginBottom: "2px" }}>Account</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>{user?.name || "User"}</div>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={dropdownButtonStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  Change Picture
                </button>

                <button
                  onClick={handleLogout}
                  style={{ ...dropdownButtonStyle, color: "#d32f2f" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fff1f0")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <input type="file" ref={fileInputRef} style={{ display: "none" }} />
    </nav>
  );
}

// --- Auxiliary Component Styles ---

const loginButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  fontWeight: "600",
  cursor: "pointer",
  color: "#1a1a1a",
  fontSize: "0.95rem",
};

const avatarStyle = (bg: string, color: string): React.CSSProperties => ({
  width: "40px",
  height: "40px",
  borderRadius: "10px",
  backgroundColor: bg,
  color: color,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
});

const dropdownContainerStyle: React.CSSProperties = {
  position: "absolute",
  right: 0,
  top: "50px",
  backgroundColor: "#fff",
  minWidth: "200px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
  padding: "8px",
  border: "1px solid #eee",
  zIndex: 1100,
};

const dropdownHeaderStyle: React.CSSProperties = {
  padding: "10px 15px",
  borderBottom: "1px solid #f0f0f0",
  marginBottom: "5px",
};

const dropdownButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 15px",
  textAlign: "left",
  background: "transparent",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: "600",
  color: "#212121",
  transition: "all 0.2s",
};