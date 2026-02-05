import { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import { useRealtime } from '../hooks/useRealtime';
import './Dashboard.css';

const Dashboard = () => {
    const [selectedTier, setSelectedTier] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);

    const { data: sensorData, loading } = useRealtime('sensorData');

    const tiers = {
        1: { name: 'Tier 1 (Prominent Leakage)', regions: [1, 2, 3, 4] },
        2: { name: 'Tier 2 (Rare Leakage)', regions: [5, 6, 7, 8] },
        3: { name: 'Tier 3 (No Leakage)', regions: [9, 10, 11, 12] },
    };

    const filterRegion = (regionNumber) => {
        setSelectedRegion(regionNumber);
    };

    const generateMockData = (regionNumber, zone) => {
        return {
            region: regionNumber,
            zone: `Zone-${regionNumber}-${zone}`,
            fm1: `FM1-${regionNumber}-${zone}: ${(Math.random() * 100).toFixed(2)} m³`,
            fm2: `FM2-${regionNumber}-${zone}: ${(Math.random() * 100).toFixed(2)} m³`,
            pressure: `PM-${regionNumber}-${zone}: ${(Math.random() * 10).toFixed(2)} kPa`,
            battery: Math.random() > 0.5 ? 'Good' : 'Low',
        };
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-content">
                <header className="dashboard-header">
                    <h1>HydroSense Dashboard</h1>
                </header>

                <div className="dashboard-main">
                    <h3>Tier - Flow Meter Data</h3>

                    <div className="tier-buttons">
                        {Object.entries(tiers).map(([tierId, tier]) => (
                            <div key={tierId} className="tier-dropdown">
                                <button
                                    className="tier-btn"
                                    onClick={() => setSelectedTier(selectedTier === tierId ? null : tierId)}
                                >
                                    {tier.name} ▼
                                </button>
                                {selectedTier === tierId && (
                                    <div className="dropdown-menu">
                                        {tier.regions.map((regionId) => (
                                            <button
                                                key={regionId}
                                                className="dropdown-item"
                                                onClick={() => filterRegion(regionId)}
                                            >
                                                Region {regionId}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Real-time Sensor Data Display */}
                    {sensorData && !selectedRegion && (
                        <div className="realtime-data-card">
                            <h4>Real-time Sensor Data (Zone 1-1)</h4>
                            <div className="sensor-info">
                                <p><strong>Flow Meter 1:</strong> {sensorData.flow_meter1} m³</p>
                                <p><strong>Flow Meter 2:</strong> {sensorData.flow_meter2} m³</p>
                                <p><strong>Leak Status:</strong> {sensorData.leak_status}</p>
                                <p><strong>Battery:</strong> Good</p>
                            </div>
                        </div>
                    )}

                    {/* Table Section */}
                    <div className="table-container">
                        <table className="sensor-table">
                            <thead>
                                <tr>
                                    <th>Region Number</th>
                                    <th>Zone ID</th>
                                    <th>Flow Meter 1 ID & Readings</th>
                                    <th>Flow Meter 2 ID & Readings</th>
                                    <th>Pressure Meter ID & Readings</th>
                                    <th>Battery Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>
                                            Loading sensor data...
                                        </td>
                                    </tr>
                                ) : selectedRegion ? (
                                    Array.from({ length: 10 }, (_, i) => i + 1).map((zone) => {
                                        const data = generateMockData(selectedRegion, zone);
                                        return (
                                            <tr key={zone}>
                                                <td>Region {data.region}</td>
                                                <td>{data.zone}</td>
                                                <td>{data.fm1}</td>
                                                <td>{data.fm2}</td>
                                                <td>{data.pressure}</td>
                                                <td>
                                                    <span className={`battery-status ${data.battery.toLowerCase()}`}>
                                                        {data.battery}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : sensorData ? (
                                    <tr>
                                        <td>Region 1</td>
                                        <td>Zone-1-1</td>
                                        <td>FM1-1-1: {sensorData.flow_meter1} m³</td>
                                        <td>FM2-1-1: {sensorData.flow_meter2} m³</td>
                                        <td>PM-1-1: {sensorData.leak_status}</td>
                                        <td>
                                            <span className="battery-status good">Good</span>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>
                                            Select a region to view data
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
