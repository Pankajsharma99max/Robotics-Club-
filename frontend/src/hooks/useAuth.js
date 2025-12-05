import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            if (authService.isAuthenticated()) {
                const currentUser = authService.getCurrentUser();
                setUser(currentUser);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const userData = await authService.login(email, password);
        setUser(userData);
        setIsAuthenticated(true);
        return userData;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = (userData) => {
        setUser(userData);
        // Also update localStorage
        const token = localStorage.getItem('token');
        if (token) {
            localStorage.setItem('user', JSON.stringify(userData));
        }
    };

    return {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        checkAuth,
        updateUser,
    };
};
