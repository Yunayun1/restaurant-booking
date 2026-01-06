"use client";
import React, { useEffect, useState, useRef } from "react";
import { 
  collection, query, where, orderBy, onSnapshot, 
  addDoc, serverTimestamp, updateDoc, doc 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Send, MessageSquare } from "lucide-react";
import TopBar from "@/app/landing/TopBar"; 
import styles from "./messages.module.css";

export default function UserMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    const user = JSON.parse(stored);
    setUserEmail(user.email);

    const q = query(
      collection(db, "messages"),
      where("email", "==", user.email),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, { includeMetadataChanges: true }, (snap) => {
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt || { seconds: Date.now() / 1000 }
      }));
      setMessages(data);
      setTimeout(scrollToBottom, 100);

      // Auto-mark Admin responses as read
      snap.docs.forEach(d => {
        const msg = d.data();
        if (msg.isAdmin === true && msg.read === false) {
          updateDoc(doc(db, "messages", d.id), { read: true });
        }
      });
    });

    return () => unsub();
  }, []);

  const handleSendMessage = async () => {
    if (!replyText.trim()) return;
    const text = replyText;
    setReplyText("");

    try {
      await addDoc(collection(db, "messages"), {
        email: userEmail,
        content: text,
        read: false,
        isAdmin: false, // User is sending
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error:", error);
      setReplyText(text);
    }
  };

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <TopBar />
      
      {/* Follows your .adminChatContainer class */}
      <div className={styles.adminChatContainer} style={{ maxWidth: '1200px', margin: '100px auto 40px auto' }}>
        
        {/* User Sidebar */}
        <div className={styles.userSidebar}>
          <h3>Support</h3>
          <div className={`${styles.userTab} ${styles.activeTab}`}>
            <MessageSquare size={18} />
            <span>Chat Support</span>
          </div>
        </div>

        {/* Chat Area */}
        <div className={styles.chatArea}>
          <div className={styles.chatHeader}>
            Booking & Inquiry Support
          </div>

          <div className={styles.chatBody}>
            {messages.length === 0 ? (
              <div className={styles.empty}>
                No messages yet. Start a conversation!
              </div>
            ) : (
              messages.map((m) => (
                <div 
                  key={m.id} 
                  /* isAdmin ? styles.userMsg (Left/Grey) 
                             : styles.adminMsg (Right/Yellow) 
                  */
                  className={m.isAdmin ? styles.userMsg : styles.adminMsg}
                >
                  <div className={styles.msgBubble}>
                    {m.content}
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Follows your .chatInputRow class */}
          <div className={styles.chatInputRow}>
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}