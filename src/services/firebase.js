import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBNju3nKwqL_IKngI4z_e3oMyt_KKDGMJ4",
  authDomain: "joblogtracker.firebaseapp.com",
  projectId: "joblogtracker",
  storageBucket: "joblogtracker.firebasestorage.app",
  messagingSenderId: "1025703409765",
  appId: "1:1025703409765:web:e7b8b898dc826e15086e8c",
  measurementId: "G-PR1ELC8TNY",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

// Sign in anonymously
export async function initAuth() {
  try {
    await signInAnonymously(auth);
    console.log("Signed in anonymously");
  } catch (err) {
    console.error("Anonymous auth error:", err);
  }
}

// Push local jobs to Firebase
export async function pushToFirebase(localJobs) {
  const { collection, doc, setDoc } = await import("firebase/firestore");
  const jobsRef = collection(db, "jobs");
  for (const job of localJobs) {
    await setDoc(doc(jobsRef, job.id), { ...job, synced: true, id: job.id });
  }
}

// Pull jobs from Firebase
export async function pullFromFirebase() {
  const { collection, getDocs } = await import("firebase/firestore");
  const jobsRef = collection(db, "jobs");
  const snapshot = await getDocs(jobsRef);
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
}

export default db;
