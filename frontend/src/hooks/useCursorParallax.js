import { useEffect, useRef } from 'react';

export const useCursorParallax = (intensity = 20) => {
    const elementRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            const xPos = (clientX / innerWidth - 0.5) * intensity;
            const yPos = (clientY / innerHeight - 0.5) * intensity;

            element.style.transform = `translate(${xPos}px, ${yPos}px)`;
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [intensity]);

    return elementRef;
};
