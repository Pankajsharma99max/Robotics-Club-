import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const AnimatedParticleText = ({ isMobile, started, mousePos }) => {
    const particlesRef = useRef();
    const progressRef = useRef(0);
    const targetProgressRef = useRef(0);
    const [isHolding, setIsHolding] = useState(false);

    const particleCount = isMobile ? 6000 : 12000;

    const textPositions = useMemo(() => {
        const positions = [];
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const canvasWidth = isMobile ? 1000 : 1400;
        const canvasHeight = isMobile ? 350 : 450;
        const fontSize = isMobile ? 120 : 160;
        const scaleFactor = isMobile ? 0.014 : 0.016;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const lineSpacing = fontSize * 1.1;
        ctx.fillText('ROBOTICS', canvas.width / 2, canvas.height / 2 - lineSpacing / 2);
        ctx.fillText('CLUB', canvas.width / 2, canvas.height / 2 + lineSpacing / 2);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const textParticles = [];

        for (let y = 0; y < canvas.height; y += 4) {
            for (let x = 0; x < canvas.width; x += 4) {
                const index = (y * canvas.width + x) * 4;
                if (imageData.data[index + 3] > 128) {
                    textParticles.push({
                        x: (x - canvas.width / 2) * scaleFactor,
                        y: (canvas.height / 2 - y) * scaleFactor,
                        z: (Math.random() - 0.5) * 0.3
                    });
                }
            }
        }

        if (textParticles.length > particleCount) {
            const step = Math.floor(textParticles.length / particleCount);
            for (let i = 0; i < textParticles.length && positions.length < particleCount; i += step) {
                const p = textParticles[i];
                positions.push(new THREE.Vector3(p.x, p.y, p.z));
            }
        } else {
            textParticles.forEach(p => {
                positions.push(new THREE.Vector3(p.x, p.y, p.z));
            });
        }

        while (positions.length < particleCount) {
            positions.push(new THREE.Vector3(
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 2
            ));
        }

        return positions;
    }, [isMobile, particleCount]);

    const spherePositions = useMemo(() => {
        const positions = [];
        const radius = isMobile ? 9 : 11;

        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            positions.push(new THREE.Vector3(x, y, z));
        }

        return positions;
    }, [isMobile, particleCount]);

    const { positions, colors, sizes } = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const spherePos = spherePositions[i];
            positions[i * 3] = spherePos.x;
            positions[i * 3 + 1] = spherePos.y;
            positions[i * 3 + 2] = spherePos.z;

            colors[i * 3] = 0.7 + Math.random() * 0.3;
            colors[i * 3 + 1] = 0.4 + Math.random() * 0.2;
            colors[i * 3 + 2] = 0.95 + Math.random() * 0.05;

            sizes[i] = Math.random() * 2.5 + 1.5;
        }

        return { positions, colors, sizes };
    }, [particleCount, spherePositions]);

    useEffect(() => {
        if (!started) {
            targetProgressRef.current = 0;
            return;
        }

        targetProgressRef.current = 1;

        const timer = setTimeout(() => {
            targetProgressRef.current = 0;
            setIsHolding(false);
        }, 5000);

        const holdTimer = setTimeout(() => {
            setIsHolding(true);
        }, 3000);

        return () => {
            clearTimeout(timer);
            clearTimeout(holdTimer);
        };
    }, [started]);

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

        const targetRotationY = mousePos.x * 0.3;
        const targetRotationX = mousePos.y * 0.3;

        for (let i = 0; i < particleCount; i++) {
            const spherePos = spherePositions[i];
            const textPos = textPositions[i] || spherePositions[i];

            const x = THREE.MathUtils.lerp(spherePos.x, textPos.x, eased);
            const y = THREE.MathUtils.lerp(spherePos.y, textPos.y, eased);
            const z = THREE.MathUtils.lerp(spherePos.z, textPos.z, eased);

            const movement = isHolding ? 0.001 : 0.008;

            const burstFrequency = 0.3;
            const burstPhase = (time * burstFrequency + i * 0.1) % 1;
            const burstIntensity = burstPhase < 0.15 ? Math.sin(burstPhase * Math.PI / 0.15) * 0.5 : 0;

            const distance = Math.sqrt(x * x + y * y + z * z);
            const burstX = distance > 0 ? (x / distance) * burstIntensity : 0;
            const burstY = distance > 0 ? (y / distance) * burstIntensity : 0;
            const burstZ = distance > 0 ? (z / distance) * burstIntensity : 0;

            const parallaxStrength = 0.5;
            const mouseInfluenceX = mousePos.x * parallaxStrength * (1 - Math.abs(z) / 15);
            const mouseInfluenceY = mousePos.y * parallaxStrength * (1 - Math.abs(z) / 15);

            positions[i * 3] = x + Math.sin(time + i * 0.01) * movement + burstX + mouseInfluenceX;
            positions[i * 3 + 1] = y + Math.cos(time + i * 0.01) * movement + burstY + mouseInfluenceY;
            positions[i * 3 + 2] = z + Math.sin(time * 0.5 + i * 0.02) * (movement * 1.5) + burstZ;
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true;

        if (!isHolding) {
            particlesRef.current.rotation.y += (targetRotationY - particlesRef.current.rotation.y) * 0.05;
            particlesRef.current.rotation.x += (targetRotationX - particlesRef.current.rotation.x) * 0.05;
            particlesRef.current.rotation.y += time * 0.005;
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
                size={0.18}
                vertexColors
                transparent
                opacity={0.95}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

const PurpleGalaxySphere = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [started, setStarted] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            setMousePos({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const cameraPosition = isMobile ? [0, 0, 32] : [0, 0, 24];
    const cameraFov = isMobile ? 75 : 65;

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {!started && (
                <button
                    onClick={() => setStarted(true)}
                    className="absolute z-10 pointer-events-auto px-8 sm:px-12 py-3 sm:py-4 text-xl sm:text-2xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 animate-pulse"
                    style={{
                        boxShadow: '0 0 30px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.3)'
                    }}
                >
                    GO
                </button>
            )}

            <Canvas
                camera={{ position: cameraPosition, fov: cameraFov }}
                style={{ width: '100%', height: '100%' }}
            >
                <ambientLight intensity={0.6} />
                <pointLight position={[20, 20, 20]} intensity={2.5} color="#a855f7" />
                <pointLight position={[-20, -20, -20]} intensity={1.5} color="#8b5cf6" />
                <pointLight position={[0, 0, 20]} intensity={2} color="#d946ef" />
                <AnimatedParticleText isMobile={isMobile} started={started} mousePos={mousePos} />
            </Canvas>
        </div>
    );
};

export default PurpleGalaxySphere;
