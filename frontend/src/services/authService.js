import api from './api';

export const authService = {
    // Login
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    // Register (Admin only)
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    // Get current user
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Update password
    updatePassword: async (currentPassword, newPassword) => {
        const response = await api.put('/auth/password', {
            currentPassword,
            newPassword,
        });
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get current user from localStorage
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
};
