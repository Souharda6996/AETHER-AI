import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "FIREBASE_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "FIREBASE_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "FIREBASE_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "FIREBASE_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID || "FIREBASE_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "FIREBASE_APP_ID",
};

// Singleton guard — prevents "Firebase App named '[DEFAULT]' already exists"
// error and the memory leak that comes with duplicate initialisation.
// This is especially important in Vite's HMR environment during development.
const firebaseApp: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const googleProvider = new GoogleAuthProvider();
