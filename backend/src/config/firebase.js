import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import dotenv from 'dotenv';

dotenv.config();

// Firebase configuration using web SDK
const firebaseConfig = {
    apiKey: "AIzaSyD3t1XScGrfq7zZJm2j3mqTe9tsPIrPEPw",
    authDomain: "hydrsense.firebaseapp.com",
    databaseURL: "https://hydrsense-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "hydrsense",
    storageBucket: "hydrsense.firebasestorage.app",
    messagingSenderId: "999792379605",
    appId: "1:999792379605:web:4e56aa84fed82600ec045c",
    measurementId: "G-HY7LGW12T5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

console.log('✅ Firebase Web SDK initialized successfully');
console.log('📡 Using Firestore Database');

// Export Firestore instance and helper functions
export const db = firestore;
export {
    collection,
    doc,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy
};

// Export auth for authentication operations
export { auth };
export default app;
