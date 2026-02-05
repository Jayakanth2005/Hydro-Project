
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let dbAdminInstance;

const initializeAdmin = () => {
    if (admin.apps.length && admin.apps.some(app => app.name === 'admin-app')) {
        return admin.firestore(admin.app('admin-app'));
    }

    try {
        let privateKey = process.env.FIREBASE_PRIVATE_KEY;

        if (!privateKey) {
            console.warn('⚠️ FIREBASE_PRIVATE_KEY not found in .env.');
            return null;
        }

        // Fix common formatting issues with .env private keys
        // 1. Replace literal '\n' string with actual newlines
        privateKey = privateKey.replace(/\\n/g, '\n');

        // 2. Remove extra quotes if present
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
            privateKey = privateKey.slice(1, -1);
        }

        const serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        };

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DATABASE_URL
        }, 'admin-app'); // Give it a specific name to avoid conflict if default app exists

        console.log('✅ Firebase Admin SDK initialized');
        return admin.firestore(admin.app('admin-app'));

    } catch (error) {
        console.error('❌ Firebase Admin SDK initialization error:', error.message);
        console.error('📌 Tip: Ensure FIREBASE_PRIVATE_KEY in .env is one line with \\n for newlines, or properly quoted.');
        return null;
    }
};

// Lazy initialization proxy
export const dbAdmin = {
    collection: (path) => {
        if (!dbAdminInstance) {
            dbAdminInstance = initializeAdmin();
        }
        if (!dbAdminInstance) {
            throw new Error('Firebase Admin SDK is not initialized. Check server logs for private key errors.');
        }
        return dbAdminInstance.collection(path);
    }
};

export default admin;
