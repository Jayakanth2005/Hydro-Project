import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD3t1XScGrfq7zZJm2j3mqTe9tsPIrPEPw",
    authDomain: "hydrsense.firebaseapp.com",
    databaseURL: "https://hydrsense-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "hydrsense",
    storageBucket: "hydrsense.firebasestorage.app",
    messagingSenderId: "999792379605",
    appId: "1:999792379605:web:31a361ccf3610797ec045c",
    measurementId: "G-F1F3XQCY13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Element references
const loginSelection = document.getElementById('login-selection');
const userAuthContainer = document.getElementById('user-auth-container');
const govAuthContainer = document.getElementById('gov-auth-container');

// Switching views
document.getElementById('user-login-option').addEventListener('click', () => {
    loginSelection.classList.add('hidden');
    userAuthContainer.classList.remove('hidden');
});

document.getElementById('gov-login-option').addEventListener('click', () => {
    loginSelection.classList.add('hidden');
    govAuthContainer.classList.remove('hidden');
});

document.getElementById('switch-to-user-login').addEventListener('click', () => {
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
});

document.getElementById('switch-to-signup').addEventListener('click', () => {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
});

// Firebase User Signup
document.getElementById('signup-button').addEventListener('click', () => {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Signup successful!");
            window.location.href = "government web/index.html"; // Redirect to User Dashboard
        })
        .catch(error => alert("Error: " + error.message));
});

// Firebase User Login
document.getElementById('user-login-button').addEventListener('click', () => {
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Login successful!");
            window.location.href = "government web/index.html"; // Redirect to User Dashboard
        })
        .catch(error => alert("Error: " + error.message));
});

// Government Login (Static Check)
document.getElementById('gov-login-button').addEventListener('click', () => {
    const email = document.getElementById('gov-email').value;
    const password = document.getElementById('gov-password').value;

    // Replace with actual validation logic as needed
    if (email === "government@gmail.com" && password === "gov_pass") {
        alert("Government login successful!");
        window.location.href = "user web/dashboard.html"; // Redirect to Government Dashboard
    } else {
        alert("Invalid government credentials.");

    }
});
