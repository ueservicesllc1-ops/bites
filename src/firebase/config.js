// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA6X41Yd6BrI3PzjKdUf-9uPjChwFLK8aM",
    authDomain: "bites-b7ad3.firebaseapp.com",
    projectId: "bites-b7ad3",
    storageBucket: "bites-b7ad3.firebasestorage.app",
    messagingSenderId: "958075407473",
    appId: "1:958075407473:web:48887253ce60830875dfd0",
    measurementId: "G-2G5C5CF0C5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore (Database) and Auth
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, analytics, db, auth, storage };
