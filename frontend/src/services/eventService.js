import api from './api';

export const eventService = {
    // Get all events
    getAll: async (filters = {}) => {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/events?${params}`);
        return response.data;
    },

    // Get single event
    getById: async (id) => {
        const response = await api.get(`/events/${id}`);
        return response.data;
    },

    // Create event
    create: async (eventData) => {
        const formData = new FormData();

        Object.keys(eventData).forEach(key => {
            if (eventData[key] instanceof File) {
                formData.append(key, eventData[key]);
            } else if (typeof eventData[key] === 'object') {
                formData.append(key, JSON.stringify(eventData[key]));
            } else {
                formData.append(key, eventData[key]);
            }
        });

        const response = await api.post('/events', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    // Update event
    update: async (id, eventData) => {
        const formData = new FormData();

        Object.keys(eventData).forEach(key => {
            if (eventData[key] instanceof File) {
                formData.append(key, eventData[key]);
            } else if (typeof eventData[key] === 'object') {
                formData.append(key, JSON.stringify(eventData[key]));
            } else {
                formData.append(key, eventData[key]);
            }
        });

        const response = await api.put(`/events/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    // Delete event
    delete: async (id) => {
        const response = await api.delete(`/events/${id}`);
        return response.data;
    },
};
