import { db } from '../config/firebase.js';

// Get all sensor data
export const getAllSensors = async (req, res) => {
    try {
        const snapshot = await db.ref('sensorData').once('value');
        const data = snapshot.val();

        res.status(200).json({ data });
    } catch (error) {
        console.error('Get sensors error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get sensor data by region
export const getSensorsByRegion = async (req, res) => {
    try {
        const { id } = req.params;
        const snapshot = await db.ref(`sensorData/region_${id}`).once('value');
        const data = snapshot.val();

        if (!data) {
            return res.status(404).json({ error: 'Region not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        console.error('Get sensors by region error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get sensor data by zone
export const getSensorsByZone = async (req, res) => {
    try {
        const { id } = req.params;
        const snapshot = await db.ref(`sensorData/zone_${id}`).once('value');
        const data = snapshot.val();

        if (!data) {
            return res.status(404).json({ error: 'Zone not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        console.error('Get sensors by zone error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get real-time sensor data (SSE endpoint)
export const getRealtimeSensors = async (req, res) => {
    try {
        // Set headers for Server-Sent Events
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const sensorRef = db.ref('sensorData');

        const listener = sensorRef.on('value', (snapshot) => {
            const data = snapshot.val();
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        });

        // Clean up on client disconnect
        req.on('close', () => {
            sensorRef.off('value', listener);
            res.end();
        });
    } catch (error) {
        console.error('Real-time sensors error:', error);
        res.status(500).json({ error: error.message });
    }
};
