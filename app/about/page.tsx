"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import TopBar from "@/app/landing/TopBar";
import styles from "./about.module.css";
import { Star, ShieldCheck, Users, Award, GlassWater, Utensils } from 'lucide-react';

export default function AboutUs() {
  const router = useRouter();
  const primaryAccent = "#ffb400";
  const darkText = "#1a1a1a";

  return (
    <div className="min-h-screen font-sans bg-white" style={{ color: darkText }}>
      <TopBar />

      {/* Hero Header */}
      <section className="relative py-32 bg-[#0a0a0a] text-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
           <img src="/image.jpg" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4">About Us</h1>
        </div>
      </section>

      {/* The Mission Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-square bg-gray-100 overflow-hidden rounded-sm">
             <img src="/imagestaff.png" className="w-full h-full object-cover" alt="Our Dining" />
             <div className="absolute bottom-0 right-0 bg-[#ffb400] p-10 hidden md:block">
                <p className="text-4xl font-black text-black">10+</p>
                <p className="text-xs font-bold uppercase tracking-widest text-black/60">Years of Excellence</p>
             </div>
          </div>
          <div className="space-y-8">
            <div className="flex items-center gap-2">
               <span className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: primaryAccent }}>Established 2016</span>
               <ShieldCheck size={16} style={{ color: primaryAccent }} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase leading-none">We Believe in <br/> Great Moments.</h2>
            <p className="text-gray-500 leading-relaxed text-lg">
              BookingRes started with a simple idea: making dining accessible and effortless. We don't just book tables; we curate experiences that linger in your memory long after the meal is over.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Based in the heart of Phnom Penh, our team works tirelessly to bridge the gap between world-class culinary masters and passionate food lovers. Every partner restaurant is hand-vetted for atmosphere and service.
            </p>
            <div className="pt-6 grid grid-cols-2 gap-8">
               <div className="p-4 border-l-2 border-[#ffb400] bg-gray-50">
                  <h4 className="font-black uppercase text-sm mb-2">Our Vision</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">To become the gold standard for dining reservations in the city.</p>
               </div>
               <div className="p-4 border-l-2 border-[#ffb400] bg-gray-50">
                  <h4 className="font-black uppercase text-sm mb-2">Our Mission</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">Connecting people through the universal language of food.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { icon: Users, label: "Happy Clients", value: "25k+" },
            { icon: Utensils, label: "Restaurants", value: "150+" },
            { icon: GlassWater, label: "Daily Bookings", value: "1.2k" },
            { icon: Award, label: "Awards Won", value: "14" }
          ].map((stat, i) => (
            <div key={i} className="group">
               <stat.icon className="mx-auto mb-4 group-hover:scale-110 transition-transform" style={{ color: primaryAccent }} size={32} />
               <h3 className="text-3xl md:text-5xl font-black mb-2">{stat.value}</h3>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={primaryAccent} color={primaryAccent} />)}
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Meet The Team</h2>
          <div className="h-1 w-20 bg-[#ffb400] mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { name: "Keo Santra", role: "Founder & CEO", img: "/ceo.jpg" },
            { name: "Sok Channa", role: "Head of Experience", img: "/chef.jpg" },
            { name: "Vottey Dok", role: "Lead Designer", img: "/manager.jpg" }
          ].map((member, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-6 rounded-sm">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
              </div>
              <h4 className="text-xl font-black uppercase tracking-tight">{member.name}</h4>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: primaryAccent }}>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 bg-[#f7f7f7] text-center">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">Ready for an <br/> Unforgettable Meal?</h2>
        <button 
          onClick={() => router.push('/booking')}
          className="px-12 py-5 bg-black text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-[#ffb400] transition-colors duration-300"
        >
          Book Your Table Now
        </button>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 bg-[#0a0a0a] text-center border-t border-white/5">
         <div className="text-2xl font-black text-white uppercase tracking-tighter mb-4">
            Booking<span style={{ color: primaryAccent }}>Res</span>
         </div>
         <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">© 2026 BookingRes. All Rights Reserved.</p>
      </footer>
    </div>
  );
}