import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { achievementService } from '../services/achievementService';
import { FaTrophy, FaMedal, FaExternalLinkAlt } from 'react-icons/fa';

const Achievements = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAchievements();
    }, []);

    const loadAchievements = async () => {
        try {
            const data = await achievementService.getAll();
            setAchievements(data);
        } catch (error) {
            console.error('Failed to load achievements:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 px-4 pb-20">
            <div className="container mx-auto">
                <h1 className="font-display text-5xl font-bold gradient-text mb-12 text-center">
                    Our Achievements
                </h1>

                {achievements.length === 0 ? (
                    <div className="glass-card p-8 text-center max-w-2xl mx-auto">
                        <p className="text-gray-300 text-lg">
                            We are currently updating our achievements. Check back soon!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {achievements.map((achievement, index) => (
                            <motion.div
                                key={achievement._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card overflow-hidden hover-lift"
                            >
                                {achievement.images && achievement.images.length > 0 && (
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={achievement.images[0]}
                                            alt={achievement.title}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                        />
                                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                                            <FaTrophy className="text-yellow-400" />
                                            <span className="text-white text-sm font-semibold">{achievement.date ? new Date(achievement.date).getFullYear() : ''}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="p-6">
                                    <h3 className="font-display text-xl font-bold text-white mb-2">
                                        {achievement.title}
                                    </h3>
                                    <p className="text-gray-400 mb-4 line-clamp-3">
                                        {achievement.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold flex items-center gap-1">
                                            <FaMedal /> {achievement.category}
                                        </span>
                                    </div>

                                    {achievement.externalLinks && achievement.externalLinks.length > 0 && (
                                        <div className="border-t border-gray-700 pt-4 mt-4">
                                            {achievement.externalLinks.map((link, i) => (
                                                <a
                                                    key={i}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sm text-neon-blue hover:text-white transition-colors"
                                                >
                                                    <FaExternalLinkAlt size={12} />
                                                    {link.label || 'View Details'}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Achievements;
