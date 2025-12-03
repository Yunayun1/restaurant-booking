// /lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0OWthb02C_LcnQ9fW5v6FLDtQ-3_HfgI",
  authDomain: "restaurant-booking-ecf44.firebaseapp.com",
  projectId: "restaurant-booking-ecf44",
  storageBucket: "restaurant-booking-ecf44.firebasestorage.app",
  messagingSenderId: "823494226144",
  appId: "1:823494226144:web:89f358d33519dc01b42085",
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
