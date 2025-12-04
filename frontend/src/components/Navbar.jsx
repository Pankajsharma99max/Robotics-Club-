import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Events', path: '/events' },
        { name: 'Team', path: '/team' },
        { name: 'About', path: '/about' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Achievements', path: '/achievements' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-card py-4' : 'bg-transparent py-6'
            }`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <motion.img
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            src="/logo_v2.png"
                            alt="Robotics Club Logo"
                            className="h-16 w-auto object-contain"
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`font-medium transition-all duration-300 ${location.pathname === link.path
                                    ? 'neon-text-blue'
                                    : 'text-gray-300 hover:text-neon-blue'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            to="/upcoming"
                            className="btn-neon px-6 py-2 rounded-lg"
                        >
                            Upcoming
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-neon-blue text-2xl"
                    >
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden mt-4 glass-card rounded-lg p-4"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`block py-3 font-medium transition-all duration-300 ${location.pathname === link.path
                                    ? 'neon-text-blue'
                                    : 'text-gray-300 hover:text-neon-blue'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            to="/upcoming"
                            onClick={() => setIsOpen(false)}
                            className="block mt-4 btn-neon px-6 py-2 rounded-lg text-center"
                        >
                            Upcoming Events
                        </Link>
                    </motion.div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
