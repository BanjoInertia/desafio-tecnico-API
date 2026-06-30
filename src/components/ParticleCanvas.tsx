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
  shape: 'circle' | 'square' | 'plus';
  opacity: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

interface ParticleCanvasProps {
  colors: string[];
}

export function ParticleCanvas({ colors }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COUNT = 200;
    const SHAPES: Particle['shape'][] = ['circle', 'square', 'plus'];

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
      size: Math.random() * 7 + 3,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      opacity: Math.random() * 0.18 + 0.06,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    }));

    function drawShape(p: Particle) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.5;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'square') {
        ctx.strokeRect(-p.size, -p.size, p.size * 2, p.size * 2);
      } else {
        const arm = p.size;
        ctx.beginPath();
        ctx.moveTo(0, -arm);
        ctx.lineTo(0, arm);
        ctx.moveTo(-arm, 0);
        ctx.lineTo(arm, 0);
        ctx.stroke();
      }

      ctx.restore();
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const distSq = dx * dx + dy * dy;
        const radius = 130;

        if (distSq < radius * radius && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = ((radius - dist) / radius) * 0.35;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2.5) {
          p.vx = (p.vx / speed) * 2.5;
          p.vy = (p.vy / speed) * 2.5;
        }

        p.vx *= 0.97;
        p.vy *= 0.97;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        drawShape(p);
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    tick();

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    function onResize() {
      resize();
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, [colors]);

  return <Canvas ref={canvasRef} />;
}
