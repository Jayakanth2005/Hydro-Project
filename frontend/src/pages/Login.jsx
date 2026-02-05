import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [loginType, setLoginType] = useState(null); // null, 'user', 'government'
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, signup, governmentLogin } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (loginType === 'government') {
                await governmentLogin(formData.email, formData.password);
            } else if (isSignup) {
                await signup(formData.email, formData.password, formData.displayName);
            } else {
                await login(formData.email, formData.password);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    if (!loginType) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <h1>Welcome to HydroSense</h1>
                    <p>Choose your login type:</p>
                    <div className="login-type-buttons">
                        <button
                            className="login-type-btn user-btn"
                            onClick={() => setLoginType('user')}
                        >
                            User Login
                        </button>
                        <button
                            className="login-type-btn gov-btn"
                            onClick={() => setLoginType('government')}
                        >
                            Government Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>
                    {loginType === 'government'
                        ? 'Government Login'
                        : isSignup
                            ? 'Sign Up'
                            : 'User Login'}
                </h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {isSignup && loginType !== 'government' && (
                        <div className="form-group">
                            <input
                                type="text"
                                name="displayName"
                                placeholder="Display Name"
                                value={formData.displayName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder={loginType === 'government' ? 'Government Email' : 'Email'}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Log In'}
                    </button>
                </form>

                {loginType !== 'government' && (
                    <p className="toggle-form">
                        {isSignup ? 'Already have an account? ' : 'New user? '}
                        <a href="#" onClick={() => setIsSignup(!isSignup)}>
                            {isSignup ? 'Log In' : 'Create an Account'}
                        </a>
                    </p>
                )}

                <button
                    className="back-btn"
                    onClick={() => {
                        setLoginType(null);
                        setIsSignup(false);
                        setError('');
                    }}
                >
                    ← Back
                </button>
            </div>
        </div>
    );
};

export default Login;
