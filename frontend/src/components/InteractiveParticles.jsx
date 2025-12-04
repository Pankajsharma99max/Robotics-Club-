import React, { useEffect, useRef } from 'react';

const InteractiveParticles = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        // Set canvas size
        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off edges
                if (this.x > canvas.width || this.x < 0) {
                    this.speedX = -this.speedX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.speedY = -this.speedY;
                }

                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const maxDistance = mouse.radius;
                        const force = (maxDistance - distance) / maxDistance;

                        this.x -= forceDirectionX * force * 3;
                        this.y -= forceDirectionY * force * 3;
                    }
                }
            }

            draw() {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Create particles
        const init = () => {
            particles = [];
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 9000);
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        };
        init();

        // Connect particles with lines
        const connect = () => {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        const opacity = 1 - distance / 120;
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {
                particle.update();
                particle.draw();
            });

            connect();
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        // Mouse move event
        const handleMouseMove = (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        // Cleanup
        return () => {
            window.removeEventListener('resize', setCanvasSize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none"
            style={{ background: 'transparent' }}
        />
    );
};

export default InteractiveParticles;
