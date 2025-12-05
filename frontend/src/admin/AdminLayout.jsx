import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaCalendar, FaUsers, FaTrophy, FaImages, FaCog, FaBullhorn, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const AdminLayout = () => {
    const { user, isAuthenticated, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/admin/login');
        }
    }, [isAuthenticated, loading, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: FaHome },
        { name: 'Events', path: '/admin/events', icon: FaCalendar },
        { name: 'Team', path: '/admin/team', icon: FaUsers },
        { name: 'Achievements', path: '/admin/achievements', icon: FaTrophy },
        { name: 'Gallery', path: '/admin/gallery', icon: FaImages },
        { name: 'Home Content', path: '/admin/home', icon: FaHome },
        { name: 'Announcements', path: '/admin/announcements', icon: FaBullhorn },
        { name: 'Settings', path: '/admin/settings', icon: FaCog },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 glass-card border-r border-neon-blue/20 p-6">
                <div className="mb-8">
                    <h2 className="font-display text-2xl font-bold gradient-text">Admin Panel</h2>
                    <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-neon-blue/20 text-neon-blue rounded-full text-xs">
                        {user?.role}
                    </span>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-neon-blue/20 text-neon-blue neon-glow-blue'
                                    : 'text-gray-400 hover:bg-neon-purple/10 hover:text-neon-purple'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all mt-8"
                    >
                        <FaSignOutAlt size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Outlet />
                </motion.div>
            </main>
        </div>
    );
};

export default AdminLayout;
