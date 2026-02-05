import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/common/Sidebar';
import './Reports.css';

function Reports() {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [stats, setStats] = useState({
        totalConsumption: 0,
        averageQuality: 0,
        activeAlerts: 0,
        resolvedIssues: 0
    });

    useEffect(() => {
        fetchReports();
        fetchStats();
    }, [selectedPeriod]);

    const fetchReports = async () => {
        try {
            // TODO: Fetch from API
            setReports([
                {
                    id: 1,
                    title: 'Weekly Water Quality Report',
                    type: 'quality',
                    generatedDate: new Date().toISOString(),
                    period: 'week',
                    summary: 'Overall water quality remains good across all zones'
                },
                {
                    id: 2,
                    title: 'Monthly Consumption Report',
                    type: 'consumption',
                    generatedDate: new Date(Date.now() - 86400000).toISOString(),
                    period: 'month',
                    summary: 'Total consumption decreased by 5% compared to last month'
                }
            ]);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const fetchStats = async () => {
        try {
            // TODO: Fetch from API
            setStats({
                totalConsumption: 12500,
                averageQuality: 8.5,
                activeAlerts: 3,
                resolvedIssues: 24
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const generateReport = async () => {
        try {
            // TODO: Call API to generate report
            console.log('Generating report for period:', selectedPeriod);
            alert('Report generation started. You will be notified when ready.');
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    const getReportIcon = (type) => {
        const icons = {
            quality: '💧',
            consumption: '📊',
            maintenance: '🔧',
            alerts: '⚠️'
        };
        return icons[type] || '📄';
    };

    return (
        <div className="reports-page">
            <Sidebar />
            <div className="reports-content">
                <div className="reports-header">
                    <h1>Reports & Analytics</h1>
                    {user?.role === 'government' && (
                        <div className="report-controls">
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="period-select"
                            >
                                <option value="day">Daily</option>
                                <option value="week">Weekly</option>
                                <option value="month">Monthly</option>
                                <option value="year">Yearly</option>
                            </select>
                            <button className="generate-btn" onClick={generateReport}>
                                Generate Report
                            </button>
                        </div>
                    )}
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">💧</div>
                        <div className="stat-info">
                            <h3>{stats.totalConsumption.toLocaleString()} L</h3>
                            <p>Total Consumption</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⭐</div>
                        <div className="stat-info">
                            <h3>{stats.averageQuality}/10</h3>
                            <p>Average Quality</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⚠️</div>
                        <div className="stat-info">
                            <h3>{stats.activeAlerts}</h3>
                            <p>Active Alerts</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <h3>{stats.resolvedIssues}</h3>
                            <p>Resolved Issues</p>
                        </div>
                    </div>
                </div>

                <div className="reports-list">
                    <h2>Generated Reports</h2>
                    <div className="reports-grid">
                        {reports.map(report => (
                            <div key={report.id} className="report-card">
                                <div className="report-icon-large">
                                    {getReportIcon(report.type)}
                                </div>
                                <h3>{report.title}</h3>
                                <p className="report-summary">{report.summary}</p>
                                <div className="report-meta">
                                    <span>📅 {new Date(report.generatedDate).toLocaleDateString()}</span>
                                    <span>📊 {report.period}</span>
                                </div>
                                <div className="report-actions">
                                    <button className="action-btn primary">View</button>
                                    <button className="action-btn">Download PDF</button>
                                    <button className="action-btn">Share</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reports;
