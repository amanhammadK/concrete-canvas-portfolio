import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MagnifyingCursor() {
    const cursorX = useMotionValue(-200);
    const cursorY = useMotionValue(-200);

    const springConfig = { damping: 30, stiffness: 180, mass: 0.5 };
    const x = useSpring(cursorX, springConfig);
    const y = useSpring(cursorY, springConfig);

    useEffect(() => {
        const move = (e: MouseEvent) => {
            cursorX.set(e.clientX - 120);
            cursorY.set(e.clientY - 120);
        };
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, []);

    return (
        <>
            {/* Outer glow ring — warm white, NOT neon */}
            <motion.div
                className="pointer-events-none fixed top-0 left-0 w-[240px] h-[240px] rounded-full z-50"
                style={{
                    x,
                    y,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)',
                }}
            />
            {/* Inner bright hotspot */}
            <motion.div
                className="pointer-events-none fixed top-0 left-0 w-[80px] h-[80px] rounded-full z-50 mix-blend-overlay"
                style={{
                    x: useSpring(cursorX, { ...springConfig, stiffness: 250 }),
                    y: useSpring(cursorY, { ...springConfig, stiffness: 250 }),
                    marginLeft: 80,
                    marginTop: 80,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
                }}
            />
        </>
    );
}
