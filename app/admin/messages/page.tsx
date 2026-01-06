"use client";
import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Send, User } from "lucide-react";
import styles from "./AdminMessages.module.css"; 

export default function AdminMessagesPage() {
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setAllMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Get unique list of user emails
  const userList = Array.from(new Set(allMessages.map(m => m.email)));
  const chatMessages = allMessages.filter(m => m.email === selectedUser);

  const handleAdminReply = async () => {
    if (!replyText.trim() || !selectedUser) return;
    await addDoc(collection(db, "messages"), {
      email: selectedUser,
      title: "Admin Update",
      content: replyText,
      read: false,
      isAdmin: true,
      createdAt: serverTimestamp(),
    });
    setReplyText("");
  };

  return (
    <div className={styles.adminChatContainer}>
      {/* Sidebar: List of Users */}
      <div className={styles.userSidebar}>
        <h3>Guest Chats</h3>
        {userList.map(email => (
          <div 
            key={email} 
            className={`${styles.userTab} ${selectedUser === email ? styles.activeTab : ""}`}
            onClick={() => setSelectedUser(email)}
          >
            <User size={16} /> {email}
          </div>
        ))}
      </div>

      {/* Main: Chat View */}
      <div className={styles.chatArea}>
        {selectedUser ? (
          <>
            <div className={styles.chatHeader}>Chatting with: {selectedUser}</div>
            <div className={styles.chatBody}>
              {chatMessages.map(m => (
                <div key={m.id} className={m.isAdmin ? styles.adminMsg : styles.userMsg}>
                  <div className={styles.msgBubble}>{m.content}</div>
                </div>
              ))}
            </div>
            <div className={styles.chatInputRow}>
              <input 
                value={replyText} 
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Reply as Admin..."
                onKeyDown={(e) => e.key === "Enter" && handleAdminReply()}
              />
              <button onClick={handleAdminReply}><Send size={18} /></button>
            </div>
          </>
        ) : <p className={styles.empty}>Select a guest to start messaging</p>}
      </div>
    </div>
  );
}