import { auth } from '../config/firebase.js';
import dotenv from 'dotenv';

dotenv.config();

// User Signup - handled by frontend Firebase Auth
export const signup = async (req, res) => {
    try {
        const { email, displayName } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Since we're using web SDK, user creation happens on frontend
        // This endpoint just acknowledges the signup
        res.status(201).json({
            message: 'User signup initiated. Please complete on frontend.',
            user: {
                email,
                displayName: displayName || email.split('@')[0],
            },
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(400).json({ error: error.message });
    }
};

// User Login - handled by frontend Firebase Auth
export const login = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Login is handled by frontend Firebase Auth
        // This endpoint just acknowledges the login
        res.status(200).json({
            message: 'Login successful',
            user: {
                email,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ error: 'Invalid credentials' });
    }
};

// Government Login
export const governmentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const govEmail = process.env.GOV_EMAIL || 'government@gmail.com';
        const govPassword = process.env.GOV_PASSWORD || 'gov_pass';

        if (email === govEmail && password === govPassword) {
            res.status(200).json({
                message: 'Government login successful',
                user: {
                    uid: 'government-user',
                    email: govEmail,
                    displayName: 'Government Admin',
                    role: 'government',
                },
            });
        } else {
            res.status(401).json({ error: 'Invalid government credentials' });
        }
    } catch (error) {
        console.error('Government login error:', error);
        res.status(400).json({ error: error.message });
    }
};

// Get Current User
export const getCurrentUser = async (req, res) => {
    try {
        res.status(200).json({
            user: {
                uid: req.user.uid,
                email: req.user.email,
                displayName: req.user.displayName || req.user.email.split('@')[0],
                role: req.user.role,
            },
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(400).json({ error: error.message });
    }
};

// Logout (client-side handles token removal)
export const logout = async (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};
