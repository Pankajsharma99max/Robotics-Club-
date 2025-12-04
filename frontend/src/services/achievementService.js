import api from './api';

export const achievementService = {
    getAll: async (category) => {
        const params = category ? `?category=${category}` : '';
        const response = await api.get(`/achievements${params}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/achievements/${id}`);
        return response.data;
    },

    create: async (achievementData) => {
        const formData = new FormData();

        Object.keys(achievementData).forEach(key => {
            if (key === 'images' || key === 'certificates') {
                achievementData[key].forEach(file => {
                    formData.append(key, file);
                });
            } else if (key === 'externalLinks') {
                formData.append(key, JSON.stringify(achievementData[key]));
            } else {
                formData.append(key, achievementData[key]);
            }
        });

        const response = await api.post('/achievements', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    update: async (id, achievementData) => {
        const formData = new FormData();

        Object.keys(achievementData).forEach(key => {
            if (key === 'images' || key === 'certificates') {
                if (Array.isArray(achievementData[key])) {
                    achievementData[key].forEach(file => {
                        if (file instanceof File) {
                            formData.append(key, file);
                        }
                    });
                }
            } else if (key === 'externalLinks') {
                formData.append(key, JSON.stringify(achievementData[key]));
            } else {
                formData.append(key, achievementData[key]);
            }
        });

        const response = await api.put(`/achievements/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/achievements/${id}`);
        return response.data;
    },
};
