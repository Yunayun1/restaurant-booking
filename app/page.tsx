"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
// Import all necessary Lucide icons and LucideProps for typing
import { Menu, Search, Phone, Mail, MapPin, Link as LinkIcon, LucideProps } from 'lucide-react'; 
import React from 'react';

/**
 * 🎨 Global/Reusable Styles & Constants
 */
const styles = {
  primaryTextColor: "#212121",
  accentButtonColor: "#ffb400",
  // Base styles for main content container
  mainContentContainer: {
    padding: "60px",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "sans-serif",
    color: "#212121",
  } as React.CSSProperties, // Cast to CSSProperties for full type safety
  // Base style for buttons
  primaryButton: {
    backgroundColor: "#ffb400",
    padding: "15px 35px",
    borderRadius: "5px",
    border: "none",
    fontSize: "1.2rem",
    fontWeight: "600",
    cursor: "pointer",
    color: "#212121",
    transition: "background-color 0.3s ease",
  } as React.CSSProperties,
  // Style for all major headings
  sectionHeading: {
    fontSize: "1.5rem", 
    fontWeight: "bold", 
    marginBottom: "20px"
  } as React.CSSProperties
};

/**
 * 🖼️ Static Data
 */
const galleryImages = [
  "/res1.jpg",
  "/res2.jpg",
  "/res3.jpg",
  "/res4.jpg",
  "/res5.jpg",
  "/res6.jpg",
];

const hoursData = [
  { day: "Mon", open: "9 am", close: "8 pm" },
  { day: "Tue", open: "9 am", close: "8 pm" },
  { day: "Wed", open: "9 am", close: "8 pm" },
  { day: "Thu", open: "9 am", close: "8 pm" },
  { day: "Fri", open: "9 am", close: "8 pm" },
  { day: "Sat", open: "-", close: "-" },
  { day: "Sun", open: "-", close: "-" },
];

const contactData = [
    { icon: Phone, text: "+855 123456789", label: "Phone" },
    { icon: Mail, text: "bookinres@gmail.com", label: "Email" },
    { icon: MapPin, text: "123 Phnom Penh", label: "Address" },
    { icon: LinkIcon, text: "nichaikoleminive2.zm.memosh.notendo.com.ua", label: "Website" },
];

/**
 * 💡 Prop Types for the custom Icon component
 */
interface IconProps {
  // Use React.FC<LucideProps> to correctly type the Lucide icon component itself
  IconComponent: React.FC<LucideProps>; 
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}


/**
 * 💡 Custom Icon Component (Type-Safe)
 */
const Icon: React.FC<IconProps> = ({ IconComponent, size = 20, color = styles.primaryTextColor, style = {} }) => (
    <IconComponent size={size} color={color} style={{ marginRight: '8px', minWidth: `${size}px`, ...style }} />
);


/**
 * 💻 Main Component
 */
export default function LandingPage() {
  const router = useRouter();

  const handleBookNowClick = () => {
    router.push("/auth/login");
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "white",
        overflowX: "hidden",
      }}
    >
      {/* 🌟 HERO SECTION */}
      <div
        style={{
          backgroundImage: "url('/image.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "600px", 
          position: "relative",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        
        {/* BLUR OVERLAY (z-index: 5) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            zIndex: 5,
          }}
        ></div>

        {/* Top Navigation (z-index: 10) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: "20px 60px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.25)",
            zIndex: 10, 
          }}
        >
          {/* Left side: Menu Icon and Logo */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Menu Icon using Lucide React */}
            <div
              style={{
                backgroundColor: styles.accentButtonColor,
                borderRadius: "5px",
                padding: "10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                // Added a small hover effect for polish
                transition: "opacity 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
                <Menu size={24} color={styles.primaryTextColor} />
            </div>
            <span style={{ marginLeft: "10px", fontWeight: "bold" }}>/tfobc.jpg</span>
          </div>

          {/* Right side: Contact Info/Search */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "20px" }}>Restaurants Booker push:/auth</span>
            <div style={{ cursor: 'pointer', padding: '5px' }}>
                <Search size={20} color="white" /> {/* Cute vector search icon */}
            </div>
          </div>
        </div>

        {/* Vertical HOME text (z-index: 10) */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "10px",
            transform: "translateY(-50%) rotate(-90deg)",
            transformOrigin: "bottom left",
            letterSpacing: "0.2em",
            fontSize: "0.9rem",
            fontWeight: "600",
            zIndex: 10, 
          }}
        >
          HOME
        </div>

        {/* Title + Button (z-index: 10) */}
        <div style={{ zIndex: 10, textAlign: "center" }}> 
          <h1
            style={{
              fontSize: "4rem",
              fontWeight: "700",
              maxWidth: "800px",
              textAlign: "center",
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            Restaurants Booking Website
          </h1>

          <button
            onClick={handleBookNowClick}
            style={styles.primaryButton}
            // Added professional hover effect
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f0a600')} 
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.accentButtonColor)}
          >
            Book now
          </button>
        </div>
      </div>
      
      {/* 📋 MAIN CONTENT SECTION */}
      <div style={styles.mainContentContainer}>
        
        {/* HOURS & ABOUT GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "40px",
          }}
        >
          {/* Hours */}
          <div>
            <h3 style={styles.sectionHeading}>Hours</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {hoursData.map((d) => (
                    <th key={d.day} style={{ paddingBottom: "10px", textAlign: "left" }}>
                      {d.day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ color: "#007bff" }}>
                  {hoursData.map((d) => (
                    <td key={d.day + "-open"}>{d.open}</td>
                  ))}
                </tr>
                <tr style={{ color: "#007bff" }}>
                  {hoursData.map((d) => (
                    <td key={d.day + "-close"}>{d.close}</td>
                  ))}
                </tr>
              </tbody>
            </table>

            <p style={{ marginTop: "15px", fontSize: "0.9rem", color: "#666" }}>
              Business is often provided... <a href="#" style={{ color: "#007bff", textDecoration: "none" }}>read more</a>
            </p>
          </div>

          {/* About/Contact */}
          <div>
            <h3 style={styles.sectionHeading}>Contact Information</h3>
            <div style={{ fontSize: "0.9rem", marginBottom: "15px" }}>
                {contactData.map((item, index) => (
                    <p key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <Icon IconComponent={item.icon} size={16} color="#007bff" />
                        <span style={{ color: styles.primaryTextColor }}>{item.text}</span>
                    </p>
                ))}
            </div>
            {/* Social Icons (Placeholder text for symbols) */}
            <p style={{ marginTop: "20px" }}>
                {/* Replace these placeholders with actual social media Icon components */}
                <a href="#" style={{ marginRight: '10px', color: '#666' }}>[FB]</a>
                <a href="#" style={{ marginRight: '10px', color: '#666' }}>[IG]</a>
                <a href="#" style={{ color: '#666' }}>[TW]</a>
            </p>
          </div>
        </div>
        
        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '40px 0' }} />

        {/* GALLERY SECTION */}
        <div style={{ marginTop: "40px" }}>
          <h3 style={styles.sectionHeading}>Photo Gallery</h3>
          <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "10px" }}>
            Check out the beautiful ambiance and delicious food at our restaurant.
          </p>

          <div
            style={{
              display: "grid",
              // Responsive grid: minimum image size of 150px
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", 
              gap: "10px",
            }}
          >
            {galleryImages.map((src, index) => (
              <div
                key={index}
                style={{
                  height: "150px", 
                  borderRadius: "5px",
                  overflow: "hidden",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)", // Subtle shadow for depth
                }}
              >
                {/* Using standard <img> tag, but Next.js <Image> is recommended for optimization */}
                <img
                  src={src}
                  alt={`Gallery Image ${index + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: 'block' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}