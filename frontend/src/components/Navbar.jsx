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
                        <div className="flex items-center space-x-4 ml-4 border-l border-gray-700 pl-4">
                            <Link
                                to="/login"
                                className="text-gray-300 hover:text-neon-blue font-medium transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="btn-neon px-5 py-2 rounded-lg text-sm"
                            >
                                Sign Up
                            </Link>
                        </div>
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
                        <div className="mt-4 pt-4 border-t border-gray-700 flex flex-col space-y-3">
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="block text-center text-gray-300 hover:text-neon-blue font-medium"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                onClick={() => setIsOpen(false)}
                                className="block btn-neon px-6 py-2 rounded-lg text-center"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
