import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 Replace with your real Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBzOr4G3YssP1_6fvllwRNN8sCCELbgds",
  authDomain: "time-weaver-6c000.firebaseapp.com",
  projectId: "time-weaver-6c000",
  storageBucket: "time-weaver-6c000.firebasestorage.app",
  messagingSenderId: "220999229404",
  appId: "1:220999229404:web:7f5c864f75ddf4ba28b919",
  measurementId: "G-ZERGMWZ7L2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services to use in your app
export const auth = getAuth(app);
export const db = getFirestore(app);

