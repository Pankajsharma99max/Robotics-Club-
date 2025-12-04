import React from 'react';

// Simplified CSS-only background (Three.js version was causing issues)
const ParticlesBackground = () => {
    return (
        <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-dark-bg">
                {/* Grid pattern */}
                <div className="absolute inset-0 grid-pattern opacity-10"></div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 via-transparent to-neon-purple/5"></div>
            </div>
        </div>
    );
};

export default ParticlesBackground;
