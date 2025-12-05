import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { homeService, announcementService } from '../services/contentService';
import { useCursorParallax } from '../hooks/useCursorParallax';
import ScrollingRobot from '../components/ScrollingRobot';
import PurpleGalaxySphere from '../components/PurpleGalaxySphere';

const Home = () => {
    const [homeContent, setHomeContent] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const heroRef = useCursorParallax(30);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            const [home, announce] = await Promise.all([
                homeService.get(),
                announcementService.getActive()
            ]);
            setHomeContent(home);
            setAnnouncements(announce);
        } catch (error) {
            console.error('Failed to load content:', error);
        }
    };

    return (
        <div className="min-h-screen pt-20">
            <ScrollingRobot />
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-dark-bg via-purple-900/10 to-dark-bg">
                {/* Purple Galaxy Sphere with Animated Text */}
                <PurpleGalaxySphere />

                <div className="container mx-auto px-4 text-center z-10 relative">
                </div>

                {/* Starfield Background */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(100)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                opacity: Math.random() * 0.7 + 0.3
                            }}
                        />
                    ))}
                </div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 grid-pattern opacity-20"></div>
            </section>

            {/* Stats Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: 'Members', value: homeContent?.stats?.members || 0 },
                            { label: 'Projects', value: homeContent?.stats?.projects || 0 },
                            { label: 'Awards', value: homeContent?.stats?.awards || 0 },
                            { label: 'Workshops', value: homeContent?.stats?.workshops || 0 },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card p-8 text-center hover-lift"
                            >
                                <div className="text-5xl font-display font-bold text-blue-400 mb-2">
                                    {stat.value}+
                                </div>
                                <div className="text-gray-400 uppercase tracking-wider">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Announcements */}
            {announcements.length > 0 && (
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="font-display text-4xl font-bold text-center mb-12 text-white">
                            Latest Announcements
                        </h2>
                        <div className="grid gap-6 max-w-4xl mx-auto">
                            {announcements.map((announcement) => (
                                <motion.div
                                    key={announcement._id}
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="glass-card p-6 neon-border-animated"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-display text-xl font-semibold mb-2 text-neon-blue">
                                                {announcement.title}
                                            </h3>
                                            <p className="text-gray-300">{announcement.content}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${announcement.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                                            announcement.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-green-500/20 text-green-400'
                                            }`}>
                                            {announcement.priority}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="glass-card p-12 text-center max-w-4xl mx-auto neon-border">
                        <h2 className="font-display text-4xl font-bold mb-6 text-white">
                            Ready to Join the Future?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Become a part of our innovative community and shape the future of robotics
                        </p>
                        <Link to="/contact" className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 rounded-lg text-lg inline-block transition-colors">
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
