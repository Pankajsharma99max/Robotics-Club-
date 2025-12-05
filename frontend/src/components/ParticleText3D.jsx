import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Meteor shower effect
const MeteorShower = () => {
    const meteorsRef = useRef();
    const meteorCount = 50;

    const { positions, velocities } = useMemo(() => {
        const positions = new Float32Array(meteorCount * 3);
        const velocities = [];

        for (let i = 0; i < meteorCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = Math.random() * 50 + 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

            velocities.push({
                x: (Math.random() - 0.5) * 0.2,
                y: -(Math.random() * 0.5 + 0.3),
                z: (Math.random() - 0.5) * 0.2
            });
        }

        return { positions, velocities };
    }, []);

    useFrame(() => {
        if (!meteorsRef.current) return;

        const positions = meteorsRef.current.geometry.attributes.position.array;

        for (let i = 0; i < meteorCount; i++) {
            positions[i * 3] += velocities[i].x;
            positions[i * 3 + 1] += velocities[i].y;
            positions[i * 3 + 2] += velocities[i].z;

            if (positions[i * 3 + 1] < -20) {
                positions[i * 3] = (Math.random() - 0.5) * 100;
                positions[i * 3 + 1] = Math.random() * 30 + 30;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
            }
        }

        meteorsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={meteorsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={meteorCount}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.3}
                color="#ffffff"
                transparent
                opacity={0.6}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

const ParticleSystem = ({ isTextMode, scrollProgress }) => {
    const particlesRef = useRef();
    const mouseRef = useRef({ x: 0, y: 0 });
    const progressRef = useRef(0);
    const targetProgressRef = useRef(1);
    const delayTimerRef = useRef(null);
    const holdTimerRef = useRef(null);
    const [isHolding, setIsHolding] = useState(false);

    const particleCount = 35000;

    const textPositions = useMemo(() => {
        const positions = [];
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Title - Optimized size to fit in view
        canvas.width = 2000;
        canvas.height = 350;
        ctx.fillStyle = 'white';
        ctx.font = 'bold 200px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ROBOTICS CLUB', canvas.width / 2, canvas.height / 2);

        const titleData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const titleParticles = [];

        // Denser sampling for better clarity
        for (let y = 0; y < canvas.height; y += 1.5) {
            for (let x = 0; x < canvas.width; x += 1.5) {
                const index = (y * canvas.width + x) * 4;
                if (titleData.data[index + 3] > 128) {
                    titleParticles.push({
                        x: (x - canvas.width / 2) * 0.018,
                        y: (canvas.height / 2 - y) * 0.018 + 3,
                        z: (Math.random() - 0.5) * 0.1
                    });
                }
            }
        }

        // Subtitle - Optimized to be fully visible
        canvas.width = 2200;
        canvas.height = 150;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Building the Future with Innovation', canvas.width / 2, canvas.height / 2);

        const subtitleData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const subtitleParticles = [];

        // Even denser sampling for subtitle
        for (let y = 0; y < canvas.height; y += 1.2) {
            for (let x = 0; x < canvas.width; x += 1.2) {
                const index = (y * canvas.width + x) * 4;
                if (subtitleData.data[index + 3] > 128) {
                    subtitleParticles.push({
                        x: (x - canvas.width / 2) * 0.018,
                        y: (canvas.height / 2 - y) * 0.018 - 2.5,
                        z: (Math.random() - 0.5) * 0.1
                    });
                }
            }
        }

        // Combine all particles
        const allTextParticles = [...titleParticles, ...subtitleParticles];

        // Use all particles or sample if too many
        if (allTextParticles.length <= particleCount) {
            positions.push(...allTextParticles.map(p => new THREE.Vector3(p.x, p.y, p.z)));
        } else {
            const step = Math.floor(allTextParticles.length / particleCount);
            for (let i = 0; i < allTextParticles.length && positions.length < particleCount; i += step) {
                const p = allTextParticles[i];
                positions.push(new THREE.Vector3(p.x, p.y, p.z));
            }
        }

        // Fill remaining with random positions
        while (positions.length < particleCount) {
            positions.push(new THREE.Vector3(
                (Math.random() - 0.5) * 35,
                (Math.random() - 0.5) * 18,
                (Math.random() - 0.5) * 2
            ));
        }

        return positions;
    }, []);

    const spherePositions = useMemo(() => {
        const positions = [];
        const radius = 12;

        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            positions.push(new THREE.Vector3(x, y, z));
        }

        return positions;
    }, []);

    const { positions, colors, sizes } = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const spherePos = spherePositions[i];
            positions[i * 3] = spherePos.x;
            positions[i * 3 + 1] = spherePos.y;
            positions[i * 3 + 2] = spherePos.z;

            // Brighter colors
            colors[i * 3] = 0.4 + Math.random() * 0.3;
            colors[i * 3 + 1] = 0.85 + Math.random() * 0.15;
            colors[i * 3 + 2] = 1.0;

            sizes[i] = Math.random() * 2.5 + 1.5;
        }

        return { positions, colors, sizes };
    }, [spherePositions]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
        if (holdTimerRef.current) clearTimeout(holdTimerRef.current);

        if (isTextMode) {
            setIsHolding(false);
            targetProgressRef.current = 1;

            holdTimerRef.current = setTimeout(() => {
                setIsHolding(true);
            }, 3000);

            delayTimerRef.current = setTimeout(() => {
                targetProgressRef.current = 0;
                setIsHolding(false);
            }, 23000);
        } else {
            targetProgressRef.current = 0;
            setIsHolding(false);
        }

        return () => {
            if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
            if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
        };
    }, [isTextMode]);

    useFrame((state) => {
        if (!particlesRef.current) return;

        const positions = particlesRef.current.geometry.attributes.position.array;
        const time = state.clock.elapsedTime;

        const speed = isHolding ? 0 : 0.025;
        if (Math.abs(progressRef.current - targetProgressRef.current) > 0.001) {
            progressRef.current += (targetProgressRef.current - progressRef.current) * speed;
        }

        const progress = progressRef.current;
        const eased = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        for (let i = 0; i < particleCount; i++) {
            const spherePos = spherePositions[i];
            const textPos = textPositions[i] || spherePositions[i];

            const x = THREE.MathUtils.lerp(spherePos.x, textPos.x, eased);
            const y = THREE.MathUtils.lerp(spherePos.y, textPos.y, eased);
            const z = THREE.MathUtils.lerp(spherePos.z, textPos.z, eased);

            const movement = isHolding ? 0.002 : 0.015;
            const mouseInfluence = isHolding ? 0.02 : 0.12;

            const dx = x - mouseRef.current.x * 5;
            const dy = y - mouseRef.current.y * 5;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const force = Math.max(0, 1 - distance / 10);

            positions[i * 3] = x + Math.sin(time + i * 0.01) * movement + mouseRef.current.x * force * mouseInfluence;
            positions[i * 3 + 1] = y + Math.cos(time + i * 0.01) * movement + mouseRef.current.y * force * mouseInfluence;
            positions[i * 3 + 2] = z + Math.sin(time * 0.5 + i * 0.02) * (movement * 1.5);
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true;

        if (!isHolding) {
            particlesRef.current.rotation.y = time * 0.008;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={particleCount}
                    array={colors}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={particleCount}
                    array={sizes}
                    itemSize={1}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.055}
                vertexColors
                transparent
                opacity={Math.max(0, 1 - scrollProgress * 2)}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

const ParticleText3D = () => {
    const [isTextMode, setIsTextMode] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const maxScroll = window.innerHeight;
            setScrollProgress(Math.min(scrolled / maxScroll, 1));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClick = () => {
        setIsTextMode(prev => !prev);
    };

    return (
        <div
            className="fixed inset-0 -z-10 cursor-pointer transition-opacity duration-500"
            onClick={handleClick}
            style={{ opacity: Math.max(0, 1 - scrollProgress) }}
            title="Click to toggle animation"
        >
            <Canvas
                camera={{ position: [0, 0, 40], fov: 60 }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.9} />
                <pointLight position={[25, 25, 25]} intensity={3.5} color="#00e5ff" />
                <pointLight position={[-25, -25, -25]} intensity={1.8} color="#0099ff" />
                <pointLight position={[0, 0, 25]} intensity={3} color="#00ffff" />
                <spotLight position={[0, 15, 15]} intensity={2.5} color="#ffffff" angle={0.4} />

                <MeteorShower />
                <ParticleSystem isTextMode={isTextMode} scrollProgress={scrollProgress} />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.08}
                />
            </Canvas>

            <div className="absolute bottom-10 left-0 right-0 text-center">
                <p className="text-sm text-white/40 tracking-wider">
                    Click anywhere to toggle • Scroll to explore
                </p>
            </div>
        </div>
    );
};

export default ParticleText3D;
