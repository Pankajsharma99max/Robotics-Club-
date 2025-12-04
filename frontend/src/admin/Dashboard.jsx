import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendar, FaUsers, FaTrophy, FaImages } from 'react-icons/fa';

const Dashboard = () => {
    const stats = [
        { label: 'Total Events', value: '0', icon: FaCalendar, color: 'neon-blue' },
        { label: 'Team Members', value: '0', icon: FaUsers, color: 'neon-purple' },
        { label: 'Achievements', value: '0', icon: FaTrophy, color: 'neon-pink' },
        { label: 'Gallery Items', value: '0', icon: FaImages, color: 'neon-blue' },
    ];

    return (
        <div>
            <h1 className="font-display text-4xl font-bold gradient-text mb-8">
                Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6 hover-lift"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <Icon className={`text-${stat.color} text-3xl`} />
                                <span className={`text-4xl font-display font-bold text-${stat.color}`}>
                                    {stat.value}
                                </span>
                            </div>
                            <p className="text-gray-400 uppercase text-sm tracking-wider">{stat.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            <div className="glass-card p-8">
                <h2 className="font-display text-2xl font-bold mb-6 text-neon-blue">
                    Welcome to the Admin Panel
                </h2>
                <p className="text-gray-300 mb-4">
                    Use the sidebar to navigate through different management sections:
                </p>
                <ul className="space-y-2 text-gray-400">
                    <li>• <strong className="text-neon-blue">Events:</strong> Manage past and upcoming events</li>
                    <li>• <strong className="text-neon-purple">Team:</strong> Add and update team members</li>
                    <li>• <strong className="text-neon-pink">Achievements:</strong> Showcase club accomplishments</li>
                    <li>• <strong className="text-neon-blue">Gallery:</strong> Upload and organize media</li>
                    <li>• <strong className="text-neon-purple">Home Content:</strong> Edit hero section and stats</li>
                    <li>• <strong className="text-neon-pink">Announcements:</strong> Post important notices</li>
                    <li>• <strong className="text-neon-blue">Settings:</strong> Configure site settings</li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
