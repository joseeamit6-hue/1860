import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  getDocFromServer 
} from "firebase/firestore";
import { CMSData } from "../types";
import { DEFAULT_CMS_DATA } from "./defaultData";

// Amit Joshi's exact Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAFGM_fG8LaniWIqQqDA0Lb3B9zlaYzdPI",
  authDomain: "mitweb-dfec3.firebaseapp.com",
  databaseURL: "https://mitweb-dfec3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mitweb-dfec3",
  storageBucket: "mitweb-dfec3.firebasestorage.app",
  messagingSenderId: "798290228395",
  appId: "1:798290228395:web:ccdcc4191102a788b273ee",
  measurementId: "G-ERBS9JLDY9"
};

// Initialize App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// Test connection on boot according to guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "cms", "handshake"));
    console.log("Firebase connection established successfully!");
  } catch (error) {
    if (error instanceof Error && error.message.includes("offline")) {
      console.warn("Firebase is currently offline. Utilizing cached local storage state.");
    } else {
      console.warn("Firebase initialized with local synchronization mode active.", error);
    }
  }
}
testConnection();

// Safe storage helpers
const STORAGE_KEY = "amit_joshi_portfolio_data";

export async function loadCMSData(): Promise<CMSData> {
  try {
    const docRef = doc(db, "cms", "data");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as CMSData;
      // Backup locally
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (error) {
    console.warn("Could not load from Firebase. Reading local storage backup.", error);
  }

  // Read LocalStorage backup
  const localBackup = localStorage.getItem(STORAGE_KEY);
  if (localBackup) {
    try {
      return JSON.parse(localBackup);
    } catch {
      // JSON parse error
    }
  }

  // Initialize with seed data if both empty
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CMS_DATA));
  return DEFAULT_CMS_DATA;
}

export async function saveCMSData(data: CMSData, actionName = "Modified CMS Content"): Promise<boolean> {
  const updatedData = {
    ...data,
    adminLog: {
      ...data.adminLog,
      lastModification: actionName,
    }
  };

  // 1. Save Locally first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));

  // 2. Sync to Firebase
  try {
    const docRef = doc(db, "cms", "data");
    await setDoc(docRef, updatedData);
    return true; // saved successfully to cloud
  } catch (error) {
    console.error("Firebase Sync failed:", error);
    return false; // saved locally, but cloud failed
  }
}
