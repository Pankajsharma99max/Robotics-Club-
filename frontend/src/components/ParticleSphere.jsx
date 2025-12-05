import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Sphere = (props) => {
    const ref = useRef();

    // Generate random points in a sphere
    const sphere = useMemo(() => {
        const count = 5000;
        const positions = new Float32Array(count * 3);
        const radius = 1.5;

        for (let i = 0; i < count; i++) {
            const r = radius * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }
        return positions;
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        // Automatic rotation
        ref.current.rotation.y = time * 0.05;

        // Mouse interaction (cursor responsive effect)
        // state.mouse.x and state.mouse.y are normalized coordinates (-1 to 1)
        const mouseX = state.mouse.x * 0.2;
        const mouseY = state.mouse.y * 0.2;

        ref.current.rotation.x = mouseY;
        ref.current.rotation.z = mouseX;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#a855f7" // Purple-500
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
};

const ParticleSphere = () => {
    return (
        <div className="absolute inset-0 -z-10 bg-black overflow-hidden">
            <Canvas camera={{ position: [0, 0, 2.5], fov: 60 }}>
                <color attach="background" args={['#000000']} />
                <Sphere />
            </Canvas>
        </div>
    );
};

export default ParticleSphere;
