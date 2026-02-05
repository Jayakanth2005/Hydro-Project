import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/common/Sidebar';
import api from '../services/api';
import './Maintenance.css';

function Maintenance() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        scheduledDate: ''
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            // Fetch government maintenance schedules
            let governmentTasks = [];
            try {
                const govResponse = await api.get('/maintenance/government');
                governmentTasks = govResponse.data.records || [];
                // Flag them to differentiate if needed, or just map them
            } catch (err) {
                console.error('Error fetching government tasks:', err);
            }

            // Fetch standard tasks (if any API exists) or keep mocks for now if backend standard route isn't fully ready/populated
            let standardTasks = [];
            try {
                const stdResponse = await api.get('/maintenance');
                standardTasks = stdResponse.data.records || [];
            } catch (err) {
                console.error('Error fetching standard tasks:', err);
            }
            //Combine

            // Combine/Merge
            // Normalize data structure if needed
            const combinedTasks = [
                ...governmentTasks.map(task => ({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    location: task.location,
                    status: task.status,
                    scheduledDate: task.scheduledDate,
                    assignedTo: task.assignedTo || 'Unassigned',
                    isGovernment: true // Optional flag
                })),
                ...standardTasks.map(task => ({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    location: task.location,
                    status: task.status,
                    scheduledDate: task.scheduledDate || new Date(task.timestamp).toISOString(), // Handle potential data shape diffs
                    assignedTo: task.assignedTo || 'Unassigned'
                }))
            ];

            // If combined is empty, maybe show mocks or just empty? 
            // User wants to see what they added.
            setTasks(combinedTasks);

        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // TODO: Submit to API
            if (user?.role === 'government') {
                await api.post('/maintenance/government', formData);
            } else {
                // Keep existing behavior for now or handle appropriately
                console.log('Submitting maintenance task:', formData);
            }
            setShowForm(false);
            setFormData({ title: '', description: '', location: '', scheduledDate: '' });
            fetchTasks();
        } catch (error) {
            console.error('Error submitting task:', error);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            scheduled: '📅 Scheduled',
            'in-progress': '🔧 In Progress',
            completed: '✅ Completed',
            cancelled: '❌ Cancelled'
        };
        return badges[status] || status;
    };

    return (
        <div className="maintenance-page">
            <Sidebar />
            <div className="maintenance-content">
                <div className="maintenance-header">
                    <h1>Maintenance Schedule</h1>
                    {/* Debug: Show user info */}
                    <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                        User: {user?.email} | Role: {user?.role || 'not set'}
                    </div>
                    {user?.role === 'government' && (
                        <button className="new-task-btn" onClick={() => setShowForm(!showForm)}>
                            + Schedule Task
                        </button>
                    )}
                </div>

                {showForm && (
                    <div className="task-form-card">
                        <h2>Schedule Maintenance Task</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Task Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                rows="4"
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                            />
                            <input
                                type="date"
                                value={formData.scheduledDate}
                                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                required
                            />
                            <div className="form-actions">
                                <button type="submit" className="submit-btn">Schedule</button>
                                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="tasks-list">
                    {tasks.map(task => (
                        <div key={task.id} className="task-card">
                            <div className="task-header-row">
                                <h3>{task.title}</h3>
                                <span className={`status-badge ${task.status}`}>
                                    {getStatusBadge(task.status)}
                                </span>
                            </div>
                            <p className="task-description">{task.description}</p>
                            <div className="task-meta">
                                <span>📍 {task.location}</span>
                                <span>📅 {new Date(task.scheduledDate).toLocaleDateString()}</span>
                                {task.assignedTo && <span>👷 {task.assignedTo}</span>}
                            </div>
                            {user?.role === 'government' && (
                                <div className="task-actions">
                                    <button className="action-btn">Update Status</button>
                                    <button className="action-btn">Assign Team</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Maintenance;
