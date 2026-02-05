import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../services/firebase';

export const useRealtime = (path) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const dataRef = ref(database, path);

        const handleData = (snapshot) => {
            try {
                const value = snapshot.val();
                setData(value);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        const handleError = (err) => {
            setError(err.message);
            setLoading(false);
        };

        onValue(dataRef, handleData, handleError);

        return () => {
            off(dataRef, 'value', handleData);
        };
    }, [path]);

    return { data, loading, error };
};
