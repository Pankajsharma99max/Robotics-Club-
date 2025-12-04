import api from './api';

export const homeService = {
    get: async () => {
        const response = await api.get('/home');
        return response.data;
    },

    update: async (homeData) => {
        const formData = new FormData();

        Object.keys(homeData).forEach(key => {
            if (homeData[key] instanceof File) {
                formData.append(key, homeData[key]);
            } else if (typeof homeData[key] === 'object') {
                formData.append(key, JSON.stringify(homeData[key]));
            } else {
                formData.append(key, homeData[key]);
            }
        });

        const response = await api.put('/home', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};

export const announcementService = {
    getActive: async () => {
        const response = await api.get('/announcements');
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/announcements/all');
        return response.data;
    },

    create: async (announcementData) => {
        const response = await api.post('/announcements', announcementData);
        return response.data;
    },

    update: async (id, announcementData) => {
        const response = await api.put(`/announcements/${id}`, announcementData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/announcements/${id}`);
        return response.data;
    },
};

export const settingsService = {
    get: async () => {
        const response = await api.get('/settings');
        return response.data;
    },

    update: async (settingsData) => {
        const formData = new FormData();

        Object.keys(settingsData).forEach(key => {
            if (settingsData[key] instanceof File) {
                formData.append(key, settingsData[key]);
            } else if (typeof settingsData[key] === 'object') {
                formData.append(key, JSON.stringify(settingsData[key]));
            } else {
                formData.append(key, settingsData[key]);
            }
        });

        const response = await api.put('/settings', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};
