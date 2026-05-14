"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import { ChefHat, Truck, Leaf, Instagram, Facebook, Twitter, Clock, MapPin } from 'lucide-react';
import TopBar from "./TopBar"; 

export default function PizzaHousUI() {
  const router = useRouter();
  const primaryAccent = "#ffb400";
  const darkText = "#1a1a1a";

  const handleBookingClick = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      router.push("/booking");
    } else {
      localStorage.setItem("redirectAfterLogin", "/booking");
      router.push("/auth/login");
    }
  };

  const handleMenuClick = () => {
    router.push("/menu");
  };

  return (
    <div className="min-h-screen font-sans selection:bg-yellow-200" style={{ color: darkText, backgroundColor: '#fdfdfd' }}>
      
      <TopBar />

      {/* Hero Section */}
      <section className="relative h-[90vh] md:h-screen flex items-center justify-center text-white overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 z-10" />
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="/image.jpg" 
            alt="Restaurant Atmosphere" 
            className="w-full h-full object-cover animate-slow-zoom"
          />
        </div>

        <div className="relative z-20 text-center px-6 max-w-4xl">
          {/* ✅ Updated Quote: Focus on the Vibe */}
          <span className="block text-lg md:text-2xl font-serif italic mb-2 md:mb-4 tracking-wide" style={{ color: primaryAccent }}>
            Curating your perfect evening
          </span>
          {/* ✅ Updated Headline: Focus on Booking & Discovery */}
          <h1 className="text-5xl md:text-9xl font-black uppercase leading-[0.9] mb-8 drop-shadow-2xl">
            Reserve <br className="hidden md:block"/> Your Table
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleBookingClick}
              className="px-10 py-4 font-black text-xs uppercase tracking-[0.3em] transition-all bg-white text-black hover:bg-transparent hover:text-white border-2 border-white"
            >
              Booking Now
            </button>
            <button 
              onClick={handleMenuClick}
              className="px-10 py-4 font-black text-xs uppercase tracking-[0.3em] transition-all border-2 border-white/30 hover:border-white text-white"
            >
              Explore Menu
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-8 bg-white relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { icon: Leaf, title: "Curated Spaces", desc: "Handpicked locations with the best atmosphere in Phnom Penh." },
            { icon: ChefHat, title: "Top Rated", desc: "Only the highest-rated restaurants and elite culinary masters." },
            { icon: Truck, title: "Instant Access", desc: "Real-time availability and instant confirmation for your peace of mind." }
          ].map((feature, i) => (
            <div key={i} className="group flex flex-col items-center text-center">
              <div className="mb-8 w-20 h-20 flex items-center justify-center rounded-full transition-transform duration-500 group-hover:rotate-[360deg]" 
                   style={{ border: `1px solid ${primaryAccent}44`, backgroundColor: `${primaryAccent}08` }}>
                <feature.icon size={32} style={{ color: primaryAccent }} strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-black mb-4 uppercase tracking-widest">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[250px]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Table Set Gallery Section */}
      <section className="py-24 px-6 md:px-12 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none">Find Your<br/>Atmosphere</h2>
              <div className="h-1.5 w-24 mt-6" style={{ backgroundColor: primaryAccent }}></div>
            </div>
            <p className="text-gray-400 max-w-sm text-sm">Whether it's a romantic date or a business lunch, we have the perfect table set for your story.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="group relative aspect-video overflow-hidden bg-zinc-900 rounded-sm">
                <img 
                  src={`/res${num}.jpg`} 
                  alt={`Restaurant Atmosphere ${num}`} 
                  className="w-full h-full object-cover opacity-70 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute bottom-4 left-4">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                     Featured Venue {num}
                   </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opening Hours Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1 mb-6 border border-gray-200 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Visit Us Today</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12">
            Service Hours
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-b border-gray-100 py-12">
            <div className="space-y-2">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Monday — Sunday</p>
              <div className="flex flex-col items-center">
                <span className="text-5xl md:text-7xl font-black" style={{ color: primaryAccent }}>11:00 AM</span>
                <span className="text-2xl font-bold text-gray-300 my-2">UNTIL</span>
                <span className="text-5xl md:text-7xl font-black" style={{ color: darkText }}>10:00 PM</span>
              </div>
            </div>
            
            <div className="text-left md:border-l md:pl-12 border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest">Always Available</h4>
                  <p className="text-xs text-gray-500">Bookings accepted 24/7 online</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                We bridge the gap between you and the best dining spots in the city. Our partners are open daily to welcome you to a world of flavor.
              </p>
              <div className="flex items-center gap-2 text-sm font-bold">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="uppercase tracking-widest text-[10px]">Active Reservation Systems</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleBookingClick}
            className="mt-12 px-12 py-5 bg-black text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-[#ffb400] transition-colors duration-300"
          >
            Find a Restaurant
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8" style={{ backgroundColor: darkText, color: '#fff' }}>
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-10">
          <div className="text-3xl font-black uppercase tracking-tighter">
            Booking<span style={{ color: primaryAccent }}>Res</span>
          </div>
          <div className="flex space-x-10 text-gray-400">
            <Facebook size={20} className="hover:text-white cursor-pointer transition-colors" />
            <Twitter size={20} className="hover:text-white cursor-pointer transition-colors" />
            <Instagram size={20} className="hover:text-white cursor-pointer transition-colors" />
          </div>
          <div className="h-px w-full bg-white/10" />
          <div className="flex flex-col md:flex-row justify-between w-full text-[10px] uppercase tracking-[0.2em] text-gray-500 gap-4">
            <p>© 2026 BookingRes. Designed for Excellence.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 30s infinite alternate ease-in-out;
        }
      `}</style>
    </div>
  );
}