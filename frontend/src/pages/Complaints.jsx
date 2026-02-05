import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/common/Sidebar';
import api from '../services/api';
import './Complaints.css';

function Complaints() {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.displayName || '',
        email: user?.email || '',
        phone: '',
        location: '',
        complaint: ''
    });

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const response = await api.get('/complaints');
            setComplaints(response.data.complaints || []);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/complaints', formData);
            alert('Complaint submitted successfully!');
            setShowForm(false);
            setFormData({
                name: user?.displayName || '',
                email: user?.email || '',
                phone: '',
                location: '',
                complaint: ''
            });
            fetchComplaints();
        } catch (error) {
            console.error('Error submitting complaint:', error);
            alert('Failed to submit complaint. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: '🟡 Pending',
            'in-progress': '🔵 In Progress',
            resolved: '🟢 Resolved'
        };
        return badges[status] || status;
    };

    return (
        <div className="complaints-page">
            <Sidebar />
            <div className="complaints-content">
                <div className="complaints-header">
                    <h1>Complaints & Issues</h1>
                    {user?.role !== 'government' && (
                        <button className="new-complaint-btn" onClick={() => setShowForm(!showForm)}>
                            + New Complaint
                        </button>
                    )}
                </div>

                {showForm && (
                    <div className="complaint-form-card">
                        <h2>Submit New Complaint</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Describe your complaint..."
                                value={formData.complaint}
                                onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                                required
                                rows="4"
                            />
                            <div className="form-actions">
                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? 'Submitting...' : 'Submit'}
                                </button>
                                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="complaints-list">
                    {loading && complaints.length === 0 ? (
                        <p>Loading complaints...</p>
                    ) : complaints.length === 0 ? (
                        <p>No complaints found.</p>
                    ) : (
                        complaints.map(complaint => (
                            <div key={complaint.id} className="complaint-card">
                                <div className="complaint-header-row">
                                    <h3>{complaint.Complaint || complaint.complaint}</h3>
                                    <span className={`status-badge ${complaint.status || 'pending'}`}>
                                        {getStatusBadge(complaint.status || 'pending')}
                                    </span>
                                </div>
                                <div className="complaint-details">
                                    <p><strong>Name:</strong> {complaint.Name || complaint.name}</p>
                                    <p><strong>Email:</strong> {complaint.Email || complaint.email}</p>
                                    {complaint.Phone && <p><strong>Phone:</strong> {complaint.Phone}</p>}
                                    <p><strong>Location:</strong> {complaint.Location || complaint.location}</p>
                                    {complaint.timestamp && (
                                        <p><strong>Submitted:</strong> {new Date(complaint.timestamp).toLocaleString()}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Complaints;
