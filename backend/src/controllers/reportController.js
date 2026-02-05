import { db } from '../config/firebase.js';

// Get all reports
export const getAllReports = async (req, res) => {
    try {
        const snapshot = await db.ref('reports').once('value');
        const reports = [];

        snapshot.forEach((childSnapshot) => {
            reports.push({
                id: childSnapshot.key,
                ...childSnapshot.val(),
            });
        });

        reports.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        res.status(200).json({ reports });
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Create/Generate new report
export const createReport = async (req, res) => {
    try {
        const { title, type, dateRange, data } = req.body;
        const userId = req.user.uid;
        const userEmail = req.user.email;

        if (!title || !type) {
            return res.status(400).json({ error: 'Title and type are required' });
        }

        const newReportRef = db.ref('reports').push();
        const reportData = {
            title,
            type,
            dateRange: dateRange || { start: Date.now(), end: Date.now() },
            data: data || {},
            generatedBy: userEmail,
            userId,
            timestamp: Date.now(),
        };

        await newReportRef.set(reportData);

        res.status(201).json({
            message: 'Report generated successfully',
            report: {
                id: newReportRef.key,
                ...reportData,
            },
        });
    } catch (error) {
        console.error('Create report error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get specific report
export const getReportById = async (req, res) => {
    try {
        const { id } = req.params;

        const snapshot = await db.ref(`reports/${id}`).once('value');
        const report = snapshot.val();

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        res.status(200).json({
            report: {
                id,
                ...report,
            },
        });
    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({ error: error.message });
    }
};
