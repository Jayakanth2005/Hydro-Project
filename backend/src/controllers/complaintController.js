import { db, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, orderBy } from '../config/firebase.js';

// Get all complaints
export const getAllComplaints = async (req, res) => {
    try {
        const complaintsRef = collection(db, 'complaints');
        const q = query(complaintsRef, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);

        const complaints = [];
        querySnapshot.forEach((doc) => {
            complaints.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        res.status(200).json({ complaints });
    } catch (error) {
        console.error('Get complaints error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Create complaint
export const createComplaint = async (req, res) => {
    try {
        const { complaint, location, name, phone } = req.body;
        const userEmail = req.user?.email || req.body.email;

        if (!complaint || !location || !name) {
            return res.status(400).json({ error: 'Complaint, location, and name are required' });
        }

        const complaintsRef = collection(db, 'complaints');
        const complaintData = {
            Complaint: complaint,
            Email: userEmail,
            Employee_Id: req.body.employeeId || "",
            Employee_Status: req.body.employeeStatus || false,
            Location: location,
            Name: name,
            Phone: phone || "",
            timestamp: Date.now(),
            status: 'pending'
        };

        const docRef = await addDoc(complaintsRef, complaintData);

        res.status(201).json({
            message: 'Complaint submitted successfully',
            complaint: {
                id: docRef.id,
                ...complaintData,
            },
        });
    } catch (error) {
        console.error('Create complaint error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update complaint status
export const updateComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, response } = req.body;

        const complaintRef = doc(db, 'complaints', id);
        const complaintDoc = await getDoc(complaintRef);

        if (!complaintDoc.exists()) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        const updates = {
            ...(status && { status }),
            ...(response && { response }),
            updatedAt: Date.now(),
            updatedBy: req.user.email,
        };

        await updateDoc(complaintRef, updates);

        res.status(200).json({ message: 'Complaint updated successfully' });
    } catch (error) {
        console.error('Update complaint error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Delete complaint
export const deleteComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;

        const complaintRef = doc(db, 'complaints', id);
        const complaintDoc = await getDoc(complaintRef);

        if (!complaintDoc.exists()) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        const complaint = complaintDoc.data();

        if (complaint.userId !== userId && req.user.role !== 'government') {
            return res.status(403).json({ error: 'Not authorized to delete this complaint' });
        }

        await deleteDoc(complaintRef);

        res.status(200).json({ message: 'Complaint deleted successfully' });
    } catch (error) {
        console.error('Delete complaint error:', error);
        res.status(500).json({ error: error.message });
    }
};
