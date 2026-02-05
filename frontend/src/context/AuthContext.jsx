import { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const token = await firebaseUser.getIdToken();
                    localStorage.setItem('authToken', token);

                    const tokenResult = await firebaseUser.getIdTokenResult();
                    const role = tokenResult.claims.role || 'user';

                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        role,
                    });
                } catch (err) {
                    console.error('Error getting user data:', err);
                    setError(err.message);
                }
            } else {
                setUser(null);
                localStorage.removeItem('authToken');
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signup = async (email, password, displayName) => {
        try {
            setError(null);
            const { user: newUser, token } = await authService.signup(email, password, displayName);
            localStorage.setItem('authToken', token);
            return newUser;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);
            const { user: loggedInUser, token } = await authService.login(email, password);
            localStorage.setItem('authToken', token);
            return loggedInUser;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const governmentLogin = async (email, password) => {
        try {
            setError(null);
            const { user: govUser, token } = await authService.governmentLogin(email, password);
            localStorage.setItem('authToken', token);

            // Immediately set user state with government role
            setUser({
                uid: govUser.uid,
                email: govUser.email,
                displayName: govUser.displayName || 'Government Admin',
                role: 'government'
            });

            return govUser;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const logout = async () => {
        try {
            setError(null);
            await authService.logout();
            setUser(null);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const value = {
        user,
        loading,
        error,
        signup,
        login,
        governmentLogin,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
