import api from './api';

export const sensorService = {
    getAllSensors: async () => {
        const response = await api.get('/sensors');
        return response.data;
    },

    getSensorsByRegion: async (regionId) => {
        const response = await api.get(`/sensors/region/${regionId}`);
        return response.data;
    },

    getSensorsByZone: async (zoneId) => {
        const response = await api.get(`/sensors/zone/${zoneId}`);
        return response.data;
    },
};
