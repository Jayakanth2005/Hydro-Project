import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>HydroSense</h2>
            </div>
            <nav className="sidebar-nav">
                <Link to="/dashboard" className="nav-link">
                    <i className="icon">📊</i>
                    Dashboard
                </Link>
                <Link to="/map" className="nav-link">
                    <i className="icon">🗺️</i>
                    Map
                </Link>
                <Link to="/community" className="nav-link">
                    <i className="icon">👥</i>
                    Community
                </Link>
                <Link to="/complaints" className="nav-link">
                    <i className="icon">📝</i>
                    Complaints
                </Link>
                <Link to="/maintenance" className="nav-link">
                    <i className="icon">🔧</i>
                    Maintenance
                </Link>
                <Link to="/reports" className="nav-link">
                    <i className="icon">📄</i>
                    Reports
                </Link>
            </nav>
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
