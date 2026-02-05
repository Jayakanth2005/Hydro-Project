import { auth } from '../config/firebase.js';

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // For now, allow requests without auth for testing
            console.log('⚠️  No auth token provided - allowing request for testing');
            req.user = {
                uid: 'anonymous',
                email: 'anonymous@example.com',
                role: 'user',
            };
            return next();
        }

        const token = authHeader.split('Bearer ')[1];

        // Since we're using Firebase web SDK, we can't verify tokens server-side
        // For now, we'll trust the token and extract basic info
        // In production, you should use Firebase Admin SDK
        try {
            // Decode the token (without verification for now)
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const decodedToken = JSON.parse(jsonPayload);

            // Helper: Check for government email (loaded from env or default)
            const govEmail = process.env.GOV_EMAIL || 'government@gmail.com';
            let role = decodedToken.role || 'user';

            // Force government role if email matches
            if (decodedToken.email === govEmail) {
                role = 'government';
            }

            req.user = {
                uid: decodedToken.user_id || decodedToken.sub,
                email: decodedToken.email,
                role: role,
            };
            next();
        } catch (error) {
            console.error('Token decode error:', error);
            // Still allow the request
            req.user = {
                uid: 'anonymous',
                email: 'anonymous@example.com',
                role: 'user',
            };
            next();
        }
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ error: 'Authentication failed' });
    }
};

export const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
};
