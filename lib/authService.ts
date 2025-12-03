// /lib/authService.ts
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// Register new user
export const registerUser = async (username: string, email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Save additional info (username) in Firestore
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    username,
    email,
    createdAt: new Date(),
  });

  return user;
};

// Login user
export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};
