import api from './api';

export const galleryService = {
    getAll: async (category) => {
        const params = category ? `?category=${category}` : '';
        const response = await api.get(`/gallery${params}`);
        return response.data;
    },

    upload: async (files, category, caption) => {
        const formData = new FormData();

        files.forEach(file => {
            formData.append('images', file);
        });
        formData.append('category', category);
        if (caption) formData.append('caption', caption);

        const response = await api.post('/gallery', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    update: async (id, data) => {
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            if (data[key] instanceof File) {
                formData.append(key, data[key]);
            } else {
                formData.append(key, data[key]);
            }
        });

        const response = await api.put(`/gallery/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/gallery/${id}`);
        return response.data;
    },
};
