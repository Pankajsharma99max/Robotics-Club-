import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaGithub, FaYoutube } from 'react-icons/fa';
import { settingsService } from '../services/contentService';

const Footer = () => {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await settingsService.get();
            setSettings(data);
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    };

    const socialIcons = {
        facebook: FaFacebook,
        instagram: FaInstagram,
        twitter: FaTwitter,
        linkedin: FaLinkedin,
        github: FaGithub,
        youtube: FaYoutube,
    };

    return (
        <footer className="glass-card mt-20 border-t border-neon-blue/20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="font-display text-xl font-bold mb-4 gradient-text">
                            {settings?.clubName || 'ROBOTICS CLUB'}
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Building the future with innovation, creativity, and cutting-edge technology.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-display font-semibold mb-4 text-neon-blue">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-400 hover:text-neon-blue transition-colors">Home</Link></li>
                            <li><Link to="/events" className="text-gray-400 hover:text-neon-blue transition-colors">Events</Link></li>
                            <li><Link to="/team" className="text-gray-400 hover:text-neon-blue transition-colors">Team</Link></li>
                            <li><Link to="/gallery" className="text-gray-400 hover:text-neon-blue transition-colors">Gallery</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-display font-semibold mb-4 text-neon-purple">Resources</h4>
                        <ul className="space-y-2">
                            <li><Link to="/about" className="text-gray-400 hover:text-neon-purple transition-colors">About Us</Link></li>
                            <li><Link to="/achievements" className="text-gray-400 hover:text-neon-purple transition-colors">Achievements</Link></li>
                            <li><Link to="/upcoming" className="text-gray-400 hover:text-neon-purple transition-colors">Upcoming Events</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-neon-purple transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h4 className="font-display font-semibold mb-4 text-neon-pink">Connect With Us</h4>
                        <div className="flex space-x-4">
                            {settings?.socialLinks && Object.entries(settings.socialLinks).map(([platform, url]) => {
                                if (!url) return null;
                                const Icon = socialIcons[platform];
                                return Icon ? (
                                    <a
                                        key={platform}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-neon-blue transition-all duration-300 hover:scale-110"
                                    >
                                        <Icon size={24} />
                                    </a>
                                ) : null;
                            })}
                        </div>
                        {settings?.contactInfo?.email && (
                            <p className="text-gray-400 text-sm mt-4">
                                Email: <a href={`mailto:${settings.contactInfo.email}`} className="text-neon-blue hover:underline">
                                    {settings.contactInfo.email}
                                </a>
                            </p>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} {settings?.clubName || 'Robotics Club'}. All rights reserved.</p>
                    <p className="mt-2">Built with ❤️ by the Robotics Club Team</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
