import api from './api';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { auth } from './firebase';

export const authService = {
    // Sign up new user
    signup: async (email, password, displayName) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();

            // Also register with backend
            await api.post('/auth/signup', { email, password, displayName });

            return { user: userCredential.user, token };
        } catch (error) {
            throw error;
        }
    },

    // Login user
    login: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();

            // Verify with backend
            await api.post('/auth/login', { email });

            return { user: userCredential.user, token };
        } catch (error) {
            throw error;
        }
    },

    // Government login
    governmentLogin: async (email, password) => {
        try {
            const response = await api.post('/auth/government-login', { email, password });

            // Sign in with Firebase using government credentials
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();

            // Return user with government role from backend response
            return {
                user: {
                    ...userCredential.user,
                    role: 'government',  // Explicitly set government role
                    displayName: response.data.user.displayName || 'Government Admin'
                },
                token
            };
        } catch (error) {
            throw error;
        }
    },

    // Logout
    logout: async () => {
        try {
            await signOut(auth);
            await api.post('/auth/logout');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        } catch (error) {
            throw error;
        }
    },

    // Get current user
    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data.user;
        } catch (error) {
            throw error;
        }
    },
};
