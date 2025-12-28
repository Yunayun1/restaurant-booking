"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation"; // Added usePathname

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname(); // Get current route to identify active page
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const primaryAccent = "#ffb400";
  const lightBackground = "#ffffff";
  const darkText = "#444444";
  const linkHover = primaryAccent;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

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

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <nav
      style={{
        width: "100%",
        padding: "20px 60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: lightBackground,
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        borderBottom: `1px solid ${primaryAccent}40`,
      }}
    >
      {/* LOGO */}
      <div
        style={{ fontWeight: "bold", fontSize: "1.3rem", cursor: "pointer", color: primaryAccent }}
        onClick={() => router.push("/landing")}
      >
        My Restaurant
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
        {["Home", "Menu", "About Us", "Contact"].map((label) => {
          // Map label to route path
          const pathMap: Record<string, string> = {
            Home: "/landing",
            Menu: "/menu",       // ✅ corrected
            "About Us": "/aboutus",
            Contact: "/contact",
          };
          const path = pathMap[label];
          
          // Check if this specific link is the current active page
          const isActive = pathname === path;

          return (
            <div 
              key={label} 
              style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}
            >
              <span
                onClick={() => router.push(path)}
                style={{ 
                  cursor: "pointer", 
                  color: isActive ? "#000000" : darkText, // Bold black if active
                  fontWeight: isActive ? "700" : "500",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = linkHover)}
                onMouseOut={(e) => (e.currentTarget.style.color = isActive ? "#000000" : darkText)}
              >
                {label}
              </span>
              
              {/* ACTIVE INDICATOR DOT (matching your uploaded picture) */}
              {isActive && (
                <div 
                  style={{
                    width: "6px",
                    height: "6px",
                    backgroundColor: primaryAccent,
                    borderRadius: "50%",
                    marginTop: "4px",
                    position: "absolute",
                    bottom: "-12px"
                  }}
                />
              )}
            </div>
          );
        })}

        {/* AUTH SECTION */}
        {!user ? (
          <>
            <button
              onClick={() => router.push("/auth/login")}
              style={{ background: "transparent", border: "none", fontWeight: 600, cursor: "pointer", color: darkText }}
            >
              Login
            </button>
            <button
              onClick={() => router.push("/auth/register")}
              style={{ background: primaryAccent, color: "#fff", border: "none", padding: "8px 20px", borderRadius: "20px", fontWeight: 600, cursor: "pointer" }}
            >
              Sign Up
            </button>
          </>
        ) : (
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <div
              style={{ width: "42px", height: "42px", borderRadius: "50%", backgroundColor: primaryAccent, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 10px rgba(255, 180, 0, 0.3)", transition: "transform 0.2s ease" }}
              onClick={() => setShowDropdown(!showDropdown)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>

            {showDropdown && (
              <div
                style={{ position: "absolute", right: 0, top: "55px", backgroundColor: "#fff", minWidth: "200px", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", padding: "10px", display: "flex", flexDirection: "column", gap: "5px", border: "1px solid #f0f0f0", animation: "fadeIn 0.2s ease-out" }}
              >
                <div style={{ padding: "10px", fontWeight: "bold", borderBottom: "1px solid #eee", marginBottom: "5px", color: "#000000" }}>
                   Hi, {user.name}! 👋
                </div>

                <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={(e) => console.log(e.target.files?.[0])} />
                
                <button
                  onClick={triggerFileUpload}
                  style={{ ...dropdownButtonStyle, color: "#000000", display: "flex", alignItems: "center", gap: "10px" }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
                  </svg>
                  <span>Change Picture</span>
                </button>

                <button
                  onClick={handleLogout}
                  style={{ ...dropdownButtonStyle, color: "#ff4d4d", display: "flex", alignItems: "center", gap: "10px" }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fff1f1"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
}

const dropdownButtonStyle: React.CSSProperties = {
  padding: "10px 15px",
  textAlign: "left",
  background: "transparent",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: 600,
  transition: "all 0.2s ease",
};