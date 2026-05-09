"use client";
import React, { useEffect, useState, useRef } from "react";
import { 
  collection, query, where, orderBy, onSnapshot, 
  addDoc, serverTimestamp, updateDoc, doc, Timestamp 
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
      const data = snap.docs.map(d => {
        const raw = d.data();
        // Convert Firestore timestamp to JS Date
        const createdAt = raw.createdAt instanceof Timestamp
          ? raw.createdAt.toDate()
          : new Date();
        return {
          id: d.id,
          ...raw,
          createdAt
        };
      });

      // Sort just in case
      data.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      setMessages(data.filter((m: any) => m.type !== "reservation"));

      // Scroll to bottom
      setTimeout(scrollToBottom, 100);

      // Auto-mark admin responses as read
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
        isAdmin: false,
        type: "chat",
        createdAt: serverTimestamp(), // Firestore timestamp
      });

      // Optional: optimistic UI
      setMessages(prev => [
        ...prev,
        {
          id: "temp-" + Date.now(),
          email: userEmail,
          content: text,
          read: false,
          isAdmin: false,
          createdAt: new Date()
        }
      ]);
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
      setReplyText(text); // restore text if failed
    }
  };

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <TopBar />

      <div className={styles.adminChatContainer} style={{ maxWidth: '1200px', margin: '100px auto 40px auto' }}>
        
        {/* Sidebar */}
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
              messages.map(m => (
                <div
                  key={m.id}
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
