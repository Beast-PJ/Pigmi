// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAels5R4-FdoW5VTfh7m0IXzc-Bo-TM0qY",
  authDomain: "pigmi-5.firebaseapp.com",
  databaseURL: "https://pigmi-5-default-rtdb.firebaseio.com",
  projectId: "pigmi-5",
  storageBucket: "pigmi-5.firebasestorage.app",
  messagingSenderId: "300240030785",
  appId: "1:300240030785:web:eb5e4027469ccfba26cac0",
  measurementId: "G-TXST7DTPHK"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication instance
export const auth = getAuth(app);
