import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = (animationConfig) => {
    const elementRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const ctx = gsap.context(() => {
            gsap.from(element, {
                ...animationConfig,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse',
                    ...animationConfig.scrollTrigger,
                },
            });
        });

        return () => ctx.revert();
    }, [animationConfig]);

    return elementRef;
};
