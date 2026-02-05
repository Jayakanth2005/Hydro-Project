import { db, collection, addDoc, getDocs } from '../config/firebase.js';
import { auth } from '../config/firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Get all maintenance records
export const getAllMaintenance = async (req, res) => {
    try {
        const snapshot = await db.ref('maintenance').once('value');
        const records = [];

        snapshot.forEach((childSnapshot) => {
            records.push({
                id: childSnapshot.key,
                ...childSnapshot.val(),
            });
        });

        records.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        res.status(200).json({ records });
    } catch (error) {
        console.error('Get maintenance error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Create maintenance record
export const createMaintenance = async (req, res) => {
    try {
        const { title, description, location, priority, assignedTo } = req.body;
        const userId = req.user.uid;
        const userEmail = req.user.email;

        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        const newMaintenanceRef = db.ref('maintenance').push();
        const maintenanceData = {
            title,
            description,
            location: location || 'Not specified',
            priority: priority || 'medium',
            status: 'scheduled',
            assignedTo: assignedTo || 'Unassigned',
            createdBy: userEmail,
            userId,
            timestamp: Date.now(),
        };

        await newMaintenanceRef.set(maintenanceData);

        res.status(201).json({
            message: 'Maintenance record created successfully',
            record: {
                id: newMaintenanceRef.key,
                ...maintenanceData,
            },
        });
    } catch (error) {
        console.error('Create maintenance error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update maintenance record
export const updateMaintenance = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, assignedTo, notes, completedAt } = req.body;

        const maintenanceRef = db.ref(`maintenance/${id}`);
        const snapshot = await maintenanceRef.once('value');
        const record = snapshot.val();

        if (!record) {
            return res.status(404).json({ error: 'Maintenance record not found' });
        }

        const updates = {
            ...(status && { status }),
            ...(assignedTo && { assignedTo }),
            ...(notes && { notes }),
            ...(completedAt && { completedAt }),
            updatedAt: Date.now(),
            updatedBy: req.user.email,
        };

        await maintenanceRef.update(updates);

        res.status(200).json({ message: 'Maintenance record updated successfully' });
    } catch (error) {
        console.error('Update maintenance error:', error);
        res.status(500).json({ error: error.message });
    }
};
// Create government maintenance record (Firestore)
export const createGovernmentMaintenance = async (req, res) => {
    try {
        const { title, description, location, scheduledDate } = req.body;
        const userId = req.user.uid;
        const userEmail = req.user.email;

        // Verify role
        if (req.user.role !== 'government') {
            return res.status(403).json({ error: 'Unauthorized. Only government users can perform this action.' });
        }

        if (!title || !description || !scheduledDate) {
            return res.status(400).json({ error: 'Title, description, and scheduled date are required' });
        }

        // Authenticate backend instance as government user to ensure write permissions
        const govEmail = process.env.GOV_EMAIL || 'government@gmail.com';
        const govPassword = process.env.GOV_PASSWORD || 'gov_pass';

        try {
            await signInWithEmailAndPassword(auth, govEmail, govPassword);
        } catch (authError) {
            console.error('Backend government login failed:', authError.message);
            // Proceeding silently; if login matches existing session it might be fine.
        }

        const maintenanceData = {
            title,
            description,
            location: location || 'Not specified',
            scheduledDate,
            status: 'scheduled',
            createdBy: userEmail,
            userId,
            timestamp: Date.now(),
            source: 'government'
        };

        const docRef = await addDoc(collection(db, 'government_maintenance'), maintenanceData);

        res.status(201).json({
            message: 'Government maintenance schedule created successfully',
            record: {
                id: docRef.id,
                ...maintenanceData,
            },
        });
    } catch (error) {
        console.error('Create government maintenance error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get all government maintenance records
export const getGovernmentMaintenance = async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'government_maintenance'));
        const records = [];

        querySnapshot.forEach((doc) => {
            records.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Sort by timestamp if available
        records.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        res.status(200).json({ records });
    } catch (error) {
        console.error('Get government maintenance error:', error);
        res.status(500).json({ error: error.message });
    }
};
