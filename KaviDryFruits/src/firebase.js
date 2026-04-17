// Firebase Imports
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  initializeFirestore,
  enableIndexedDbPersistence,
  enableMultiTabIndexedDbPersistence,
} from "firebase/firestore";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyB7nkWb3Ce43JDhsNi9zrQ3W5tR10ivHA0",
  authDomain: "kavisdryfurits.firebaseapp.com",
  projectId: "kavisdryfurits",
  storageBucket: "kavisdryfurits.appspot.com",
  messagingSenderId: "769801543519",
  appId: "1:769801543519:web:8beff84a084dee83ad60ea",
  measurementId: "G-9PFN97BGCL",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// FIRESTORE — FIX FOR GODADDY + MUMBAI REGION
const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
  experimentalForceLongPolling: true, // ⭐ Helps in certain hosting/network environments
  useFetchStreams: false, // sometimes helps when fetch stream causes issues
});

// Enable IndexedDB persistence with multi-tab fallback & retry
async function enablePersistenceWithFallback(firestoreDb) {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    console.warn("⚠ IndexedDB not supported — offline persistence unavailable.");
    return;
  }

  try {
    // Prefer multi-tab persistence where available
    if (typeof enableMultiTabIndexedDbPersistence === "function") {
      await enableMultiTabIndexedDbPersistence(firestoreDb);
      console.info("✅ Firestore multi-tab persistence enabled.");
      return;
    }
    await enableIndexedDbPersistence(firestoreDb);
    console.info("✅ Firestore persistence enabled.");
  } catch (err) {
    // Common error cases: failed-precondition (multiple tabs) | unimplemented (browser)
    const code = err?.code || err?.message || err;
    if (code && String(code).includes("failed-precondition")) {
      console.warn("⚠ Persistence failed-precondition: another tab may have enabled persistence. Attempting single-tab fallback...");
      try {
        await enableIndexedDbPersistence(firestoreDb);
        console.info("✅ Single-tab persistence enabled as fallback.");
      } catch (err2) {
        console.warn("⚠ Could not enable single-tab persistence. Close other tabs and reload. Details:", err2);
      }
    } else if (code && String(code).includes("unimplemented")) {
      console.warn("❌ Persistence is not available in this browser (unimplemented).");
    } else {
      console.error("❌ Unexpected persistence error:", err);
      // transient retry
      try {
        await new Promise((r) => setTimeout(r, 700));
        await enableIndexedDbPersistence(firestoreDb);
        console.info("✅ Persistence enabled after retry.");
      } catch (retryErr) {
        console.warn("⚠ Persistence retry failed:", retryErr);
      }
    }
  }
}
enablePersistenceWithFallback(db).catch((e) => console.error("Persistence setup error:", e));

// Auth + Google
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Helpful network logs for debugging offline/online behaviour
if (typeof window !== "undefined") {
  window.addEventListener("online", () => console.info("🔌 Network online — Firestore will sync."));
  window.addEventListener("offline", () => console.warn("⚠️ Network offline — using cached Firestore data if available."));
}

export { app, auth, db, provider };
