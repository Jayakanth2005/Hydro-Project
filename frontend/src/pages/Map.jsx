import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Sidebar from '../components/common/Sidebar';
import 'leaflet/dist/leaflet.css';
import './Map.css';

// Fix for default marker icons in React-Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function Map() {
    const [sensors, setSensors] = useState([]);
    const [center] = useState([13.0827, 80.2707]); // Chennai coordinates

    useEffect(() => {
        fetchSensors();
    }, []);

    const fetchSensors = async () => {
        try {
            // TODO: Fetch from API
            setSensors([
                {
                    id: 1,
                    name: 'Sensor A',
                    location: { lat: 13.0827, lng: 80.2707 },
                    quality: 'Good',
                    flowRate: 120,
                    status: 'active'
                },
                {
                    id: 2,
                    name: 'Sensor B',
                    location: { lat: 13.0900, lng: 80.2800 },
                    quality: 'Moderate',
                    flowRate: 95,
                    status: 'active'
                }
            ]);
        } catch (error) {
            console.error('Error fetching sensors:', error);
        }
    };

    const getMarkerColor = (quality) => {
        const colors = {
            'Good': 'green',
            'Moderate': 'yellow',
            'Poor': 'red'
        };
        return colors[quality] || 'blue';
    };

    return (
        <div className="map-page">
            <Sidebar />
            <div className="map-content">
                <div className="map-header">
                    <h1>Water Quality Map</h1>
                    <div className="legend">
                        <span className="legend-item">
                            <span className="legend-dot green"></span> Good
                        </span>
                        <span className="legend-item">
                            <span className="legend-dot yellow"></span> Moderate
                        </span>
                        <span className="legend-item">
                            <span className="legend-dot red"></span> Poor
                        </span>
                    </div>
                </div>

                <div className="map-container">
                    <MapContainer
                        center={center}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {sensors.map(sensor => (
                            <Marker
                                key={sensor.id}
                                position={[sensor.location.lat, sensor.location.lng]}
                            >
                                <Popup>
                                    <div className="sensor-popup">
                                        <h3>{sensor.name}</h3>
                                        <p><strong>Quality:</strong> {sensor.quality}</p>
                                        <p><strong>Flow Rate:</strong> {sensor.flowRate} L/min</p>
                                        <p><strong>Status:</strong> {sensor.status}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                <div className="sensors-list">
                    <h2>Active Sensors</h2>
                    <div className="sensors-grid">
                        {sensors.map(sensor => (
                            <div key={sensor.id} className="sensor-card">
                                <div className="sensor-status" style={{
                                    backgroundColor: getMarkerColor(sensor.quality)
                                }}></div>
                                <h3>{sensor.name}</h3>
                                <p>Quality: {sensor.quality}</p>
                                <p>Flow: {sensor.flowRate} L/min</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Map;
