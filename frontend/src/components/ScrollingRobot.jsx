import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const ScrollingRobot = () => {
    const { scrollYProgress } = useScroll();
    const [isBlinking, setIsBlinking] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [particles, setParticles] = useState([]);
    const lastScrollY = useRef(0);

    // Robot moves in a circular diagonal path
    const x = useTransform(scrollYProgress, [0, 0.5, 1], [100, -40, 100]);
    const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
    const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [0, -15, 0]); // Rotates back and forth
    const y = useTransform(scrollYProgress, [0, 0.5, 1], [0, 100, 0]); // Moves down then up for arc effect

    // Rocket Particle Generation
    useEffect(() => {
        const interval = setInterval(() => {
            const newParticle = {
                id: Date.now() + Math.random(),
                x: (Math.random() - 0.5) * 20,
                y: 0,
                size: Math.random() * 0.4 + 0.1,
                speed: Math.random() * 2 + 2,
                color: Math.random() > 0.3 ? '#00f0ff' : '#b000ff'
            };

            setParticles(prev => [...prev.slice(-20), newParticle]);
        }, 50);

        return () => clearInterval(interval);
    }, []);

    // Blinking logic
    useEffect(() => {
        const blinkLoop = () => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 150);
            const nextBlink = Math.random() * 4000 + 2000;
            setTimeout(blinkLoop, nextBlink);
        };

        const timeoutId = setTimeout(blinkLoop, 2000);
        return () => clearTimeout(timeoutId);
    }, []);

    // Mouse tracking
    useEffect(() => {
        const handleMouseMove = (e) => {
            // Increased sensitivity (divisor changed from 60 to 15)
            const moveX = (e.clientX - window.innerWidth / 2) / 15;
            const moveY = (e.clientY - window.innerHeight / 2) / 15;
            setMousePos({ x: moveX, y: moveY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed right-4 top-1/3 z-[-1] pointer-events-none overflow-visible h-screen w-full max-w-[150px]">
            <motion.div
                style={{ x, opacity, rotate, y }}
                className="relative w-24 md:w-32"
            >
                {/* Rocket Exhaust Particles */}
                <div className="absolute top-[85%] left-1/2 -translate-x-1/2 w-full h-40 pointer-events-none flex justify-center">
                    <AnimatePresence>
                        {particles.map((particle) => (
                            <motion.div
                                key={particle.id}
                                initial={{ opacity: 0.8, y: 0, scale: 1 }}
                                animate={{ opacity: 0, y: 60, scale: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                style={{
                                    position: 'absolute',
                                    left: `calc(50% + ${particle.x}px)`,
                                    width: `${particle.size}rem`,
                                    height: `${particle.size}rem`,
                                    backgroundColor: particle.color,
                                    borderRadius: '50%',
                                    boxShadow: `0 0 8px ${particle.color}`
                                }}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {/* Robot Body Image */}
                <img
                    src="/robot_v5.png"
                    alt="Scrolling Robot"
                    className="w-full h-auto drop-shadow-[0_0_30px_rgba(0,240,255,0.6)] filter brightness-110"
                />

                {/* Animated Eyes */}
                {/* Adjusted for the new robot which has a larger face screen */}
                <div className="absolute top-[25%] left-[20%] w-[60%] h-[25%] flex justify-between items-center px-4">
                    <motion.div
                        animate={{
                            scaleY: isBlinking ? 0.1 : 1,
                            x: mousePos.x,
                            y: mousePos.y
                        }}
                        className="w-[35%] h-[80%] bg-cyan-300 rounded-full shadow-[0_0_15px_#00f0ff]"
                    />
                    <motion.div
                        animate={{
                            scaleY: isBlinking ? 0.1 : 1,
                            x: mousePos.x,
                            y: mousePos.y
                        }}
                        className="w-[35%] h-[80%] bg-cyan-300 rounded-full shadow-[0_0_15px_#00f0ff]"
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default ScrollingRobot;
