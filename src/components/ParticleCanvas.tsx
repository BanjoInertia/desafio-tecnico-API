import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
`;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  char: string;
  opacity: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  wanderAngle: number;
}

interface ParticleCanvasProps {
  colors: string[];
}

const CHARS = ['{', '}', '<', '>', '0', '1', '#', '$', '(', ')', ';', '=', '//', '=>', '()'];

export function ParticleCanvas({ colors }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!ctx) return;

    const COUNT = 200;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();

    particlesRef.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 10 + 16,
      char: CHARS[Math.floor(Math.random() * CHARS.length)],
      opacity: Math.random() * 0.3 + 0.13,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: 0,
      rotationSpeed: 0,
      wanderAngle: Math.random() * Math.PI * 2,
    }));

    function drawChar(p: Particle) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.font = `600 ${p.size}px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.char, 0, 0);
      ctx.restore();
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      const W = canvas!.width;
      const H = canvas!.height;

      for (const p of particles) {
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const distSq = dx * dx + dy * dy;
        const radius = 160;

        if (distSq < radius * radius && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = ((radius - dist) / radius) * 2.5;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.wanderAngle += (Math.random() - 0.5) * 0.08;
        p.vx += Math.cos(p.wanderAngle) * 0.015;
        p.vy += Math.sin(p.wanderAngle) * 0.015;

        p.vx *= 0.98;
        p.vy *= 0.98;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 3.0) {
          p.vx = (p.vx / speed) * 3.0;
          p.vy = (p.vy / speed) * 3.0;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0)  { p.x = 0;  p.vx = Math.abs(p.vx);  p.wanderAngle = Math.random() * Math.PI * 0.5; }
        if (p.x > W)  { p.x = W;  p.vx = -Math.abs(p.vx); p.wanderAngle = Math.PI - Math.random() * Math.PI * 0.5; }
        if (p.y < 0)  { p.y = 0;  p.vy = Math.abs(p.vy);  p.wanderAngle = Math.PI * 0.5 + (Math.random() - 0.5) * Math.PI * 0.5; }
        if (p.y > H)  { p.y = H;  p.vy = -Math.abs(p.vy); p.wanderAngle = -Math.PI * 0.5 + (Math.random() - 0.5) * Math.PI * 0.5; }
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const minDist = (a.size + b.size) * 0.55;
          const distSq = dx * dx + dy * dy;

          if (distSq < minDist * minDist && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const nx = dx / dist;
            const ny = dy / dist;

            const overlap = (minDist - dist) * 0.5;
            a.x -= nx * overlap;
            a.y -= ny * overlap;
            b.x += nx * overlap;
            b.y += ny * overlap;

            const dvx = b.vx - a.vx;
            const dvy = b.vy - a.vy;
            const dot = dvx * nx + dvy * ny;
            if (dot < 0) {
              a.vx += dot * nx;
              a.vy += dot * ny;
              b.vx -= dot * nx;
              b.vy -= dot * ny;
            }
          }
        }
      }

      for (const p of particles) {
        drawChar(p);
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    tick();

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, [colors]);

  return <Canvas ref={canvasRef} />;
}
