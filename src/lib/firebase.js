// src/lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Pola Singleton: Cek apakah app sudah ada, jika belum baru buat.
// Ini mencegah error "Firebase App named '[DEFAULT]' already exists" di Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export layanan yang akan kita pakai
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;