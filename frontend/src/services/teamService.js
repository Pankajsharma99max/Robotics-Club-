import api from './api';

export const teamService = {
    getAll: async (category) => {
        const params = category ? `?category=${category}` : '';
        const response = await api.get(`/team${params}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/team/${id}`);
        return response.data;
    },

    create: async (memberData) => {
        const formData = new FormData();

        Object.keys(memberData).forEach(key => {
            if (key === 'socialLinks') {
                formData.append(key, JSON.stringify(memberData[key]));
            } else if (memberData[key] instanceof File) {
                formData.append(key, memberData[key]);
            } else {
                formData.append(key, memberData[key]);
            }
        });

        const response = await api.post('/team', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    update: async (id, memberData) => {
        const formData = new FormData();

        Object.keys(memberData).forEach(key => {
            if (key === 'socialLinks') {
                formData.append(key, JSON.stringify(memberData[key]));
            } else if (memberData[key] instanceof File) {
                formData.append(key, memberData[key]);
            } else {
                formData.append(key, memberData[key]);
            }
        });

        const response = await api.put(`/team/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/team/${id}`);
        return response.data;
    },
};
