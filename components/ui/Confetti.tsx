'use client';

import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
    active: boolean;
    duration?: number;
}

export const Confetti = ({ active, duration = 3000 }: ConfettiProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!active) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const particles: any[] = [];
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

        for (let i = 0; i < 150; i++) {
            particles.push({
                x: width / 2,
                y: height / 2,
                w: Math.random() * 8 + 2,
                h: Math.random() * 8 + 2,
                dx: (Math.random() - 0.5) * 20,
                dy: (Math.random() - 0.5) * 20,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                gravity: 0.1,
                opacity: 1
            });
        }

        let animationId: number;
        const startTime = Date.now();

        const animate = () => {
            if (Date.now() - startTime > duration) {
                ctx.clearRect(0, 0, width, height);
                return;
            }

            ctx.clearRect(0, 0, width, height);

            particles.forEach((p) => {
                p.x += p.dx;
                p.y += p.dy;
                p.dy += p.gravity;
                p.rotation += 2;
                p.opacity -= 0.005;

                ctx.save();
                ctx.globalAlpha = Math.max(0, p.opacity);
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            ctx.clearRect(0, 0, width, height);
        };
    }, [active, duration]);

    if (!active) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[200]"
        />
    );
};
