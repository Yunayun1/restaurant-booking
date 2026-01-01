"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Phone, Mail, MapPin, Clock, 
  ChevronRight, Facebook, Instagram, Twitter 
} from "lucide-react";
import TopBar from "./TopBar";

const styles = {
  primaryTextColor: "#1a1a1a",
  accentColor: "#ffb400",
  secondaryTextColor: "#64748b",
  
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    padding: "35px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
    border: "1px solid #f1f5f9",
    transition: "transform 0.3s ease",
  } as React.CSSProperties,

  primaryButton: {
    backgroundColor: "#ffb400",
    padding: "18px 45px",
    borderRadius: "14px",
    border: "none",
    fontSize: "1.1rem",
    fontWeight: "700",
    cursor: "pointer",
    color: "#1a1a1a",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 10px 25px rgba(255, 180, 0, 0.25)",
  } as React.CSSProperties,

  sectionHeading: {
    fontSize: "2.2rem",
    fontWeight: "900",
    marginBottom: "16px",
    letterSpacing: "-0.03em",
    color: "#1a1a1a",
  } as React.CSSProperties
};

const hoursData = [
  { day: "Monday - Friday", time: "9:00 AM - 8:00 PM", active: true },
  { day: "Saturday", time: "Closed", active: false },
  { day: "Sunday", time: "Closed", active: false },
];

const contactData = [
  { icon: Phone, text: "+855 123 456 789", label: "Phone" },
  { icon: Mail, text: "bookinres@gmail.com", label: "Email" },
  { icon: MapPin, text: "123 Phnom Penh, Cambodia", label: "Address" },
];

export default function LandingPage() {
  const router = useRouter();
  const [hoveredImg, setHoveredImg] = useState<number | null>(null);

  return (
    <div style={{ backgroundColor: "#fdfdfd", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <TopBar />

      {/* 🌟 CENTERED HERO SECTION */}
      <div style={{ 
        position: "relative", 
        height: "90vh", 
        overflow: "hidden", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        {/* Background Image with Overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/image.jpg')",
          backgroundSize: "cover", 
          backgroundPosition: "center",
          filter: "brightness(0.55)"
        }} />
        
        {/* Hero Content Wrapper */}
        <div style={{ 
          position: "relative", 
          zIndex: 10, 
          width: "100%", 
          maxWidth: "900px", 
          margin: "0 auto", 
          padding: "0 20px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <span style={{ 
            color: styles.accentColor, 
            fontWeight: "800", 
            letterSpacing: "4px", 
            fontSize: "0.85rem",
            marginBottom: "15px",
            display: "block"
          }}>
            PREMIUM EXPERIENCE
          </span>
          
          <h1 style={{ 
            fontSize: "clamp(2.5rem, 8vw, 4.5rem)", 
            fontWeight: "900", 
            color: "white", 
            lineHeight: "1.1", 
            marginBottom: "24px",
            textShadow: "0 4px 30px rgba(0,0,0,0.2)"
          }}>
            Taste the <span style={{ color: styles.accentColor }}>Extraordinary</span>
          </h1>
          
          <p style={{ 
            color: "rgba(255,255,255,0.9)", 
            fontSize: "clamp(1rem, 4vw, 1.25rem)", 
            marginBottom: "48px", 
            lineHeight: "1.7",
            maxWidth: "650px"
          }}>
            Experience world-class dining with the easiest reservation system in Phnom Penh. 
            Join us for an unforgettable culinary journey.
          </p>
          
          {/* ✅ UPDATED BUTTON WITH REDIRECT LOGIC */}
          <button 
            onClick={() => {
              localStorage.setItem("redirectAfterLogin", "/booking");
              router.push("/auth/login");
            }}
            style={styles.primaryButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.backgroundColor = "#f0a600";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.backgroundColor = styles.accentColor;
            }}
          >
            Book Now <ChevronRight size={22} />
          </button>
        </div>

        {/* Decorative Side Label */}
        <div style={{
          position: "absolute",
          left: "30px",
          bottom: "100px",
          transform: "rotate(-90deg)",
          transformOrigin: "left bottom",
          color: "rgba(255,255,255,0.3)",
          letterSpacing: "5px",
          fontSize: "0.7rem",
          fontWeight: "700"
        }}>
          EST. 2025
        </div>
      </div>

      {/* 📋 INFO CARDS SECTION */}
      <div style={{ maxWidth: "1100px", margin: "-100px auto 0", padding: "0 20px", position: "relative", zIndex: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          
          {/* Hours Card */}
          <div style={styles.card}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{ backgroundColor: "#fffbeb", padding: "10px", borderRadius: "12px" }}>
                <Clock color={styles.accentColor} size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "800" }}>Opening Hours</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {hoursData.map((item, i) => (
                <div key={i} style={{ 
                  display: "flex", justifyContent: "space-between", 
                  paddingBottom: "12px", borderBottom: i !== hoursData.length - 1 ? "1px solid #f8fafc" : "none" 
                }}>
                  <span style={{ fontWeight: "600", color: item.active ? "#1a1a1a" : "#94a3b8" }}>{item.day}</span>
                  <span style={{ color: item.active ? "#2563eb" : "#94a3b8", fontWeight: "700" }}>{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Card */}
          <div style={{ ...styles.card, backgroundColor: styles.primaryTextColor, color: "white" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "800", marginBottom: "30px" }}>Visit Us</h3>
            {contactData.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "18px", marginBottom: "24px" }}>
                <item.icon size={20} color={styles.accentColor} />
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>{item.label}</div>
                  <div style={{ fontSize: "1rem", fontWeight: "500", marginTop: "2px" }}>{item.text}</div>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: "20px", marginTop: "30px", opacity: 0.8 }}>
               <Facebook size={20} style={{ cursor: 'pointer' }} />
               <Instagram size={20} style={{ cursor: 'pointer' }} />
               <Twitter size={20} style={{ cursor: 'pointer' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 🖼️ BENTO GALLERY */}
      <div style={{ maxWidth: "1100px", margin: "100px auto", padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 style={styles.sectionHeading}>Photo Gallery</h2>
          <div style={{ width: "60px", height: "4px", backgroundColor: styles.accentColor, margin: "0 auto", borderRadius: "2px" }} />
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
          gridAutoRows: "240px",
          gap: "20px" 
        }}>
          {[1, 2, 3, 4, 5, 6].map((img, i) => (
            <div 
              key={i} 
              onMouseEnter={() => setHoveredImg(i)}
              onMouseLeave={() => setHoveredImg(null)}
              style={{
                gridColumn: i === 0 ? "span 2" : "span 1",
                gridRow: i === 0 ? "span 2" : "span 1",
                borderRadius: "28px",
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                boxShadow: "0 20px 40px rgba(0,0,0,0.06)"
              }}
            >
              <img 
                src={`/res${i+1}.jpg`} 
                alt="Restaurant" 
                style={{ 
                  width: "100%", height: "100%", objectFit: "cover", 
                  transition: "transform 0.6s cubic-bezier(0.33, 1, 0.68, 1)",
                  transform: hoveredImg === i ? "scale(1.08)" : "scale(1)"
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <footer style={{ 
        textAlign: "center", 
        padding: "60px 20px", 
        color: "#94a3b8", 
        fontSize: "0.85rem", 
        borderTop: "1px solid #f1f5f9" 
      }}>
        &copy; 2025 MYRESTAURANT MANAGEMENT SYSTEM. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}