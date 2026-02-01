/**
 * Jarvis Background Component
 * 
 * Futuristic animated background with circuit patterns, glowing orbs,
 * and holographic effects inspired by Iron Man's Jarvis interface
 */

'use client';

import { useEffect, useRef } from 'react';

interface JarvisBackgroundProps {
  isActive?: boolean;
}

export default function JarvisBackground({ isActive = false }: JarvisBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system for floating orbs
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
      pulseSpeed: number;
      pulsePhase: number;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update(width: number, height: number) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        this.pulsePhase += this.pulseSpeed;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius * 3
        );
        gradient.addColorStop(0, `rgba(6, 182, 212, ${this.opacity * pulse})`);
        gradient.addColorStop(0.5, `rgba(6, 182, 212, ${this.opacity * pulse * 0.5})`);
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Circuit line system
    class CircuitLine {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      progress: number;
      speed: number;
      opacity: number;

      constructor(width: number, height: number) {
        const isHorizontal = Math.random() > 0.5;
        if (isHorizontal) {
          this.x1 = 0;
          this.y1 = Math.random() * height;
          this.x2 = width;
          this.y2 = this.y1;
        } else {
          this.x1 = Math.random() * width;
          this.y1 = 0;
          this.x2 = this.x1;
          this.y2 = height;
        }
        this.progress = 0;
        this.speed = Math.random() * 0.005 + 0.002;
        this.opacity = Math.random() * 0.3 + 0.1;
      }

      update() {
        this.progress += this.speed;
        if (this.progress > 1) this.progress = 0;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const currentX = this.x1 + (this.x2 - this.x1) * this.progress;
        const currentY = this.y1 + (this.y2 - this.y1) * this.progress;

        // Draw line
        ctx.strokeStyle = `rgba(6, 182, 212, ${this.opacity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();

        // Draw moving glow
        const gradient = ctx.createRadialGradient(
          currentX, currentY, 0,
          currentX, currentY, 20
        );
        gradient.addColorStop(0, `rgba(6, 182, 212, ${this.opacity})`);
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 20, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles and lines
    const particles: Particle[] = [];
    const lines: CircuitLine[] = [];

    for (let i = 0; i < 50; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    for (let i = 0; i < 8; i++) {
      lines.push(new CircuitLine(canvas.width, canvas.height));
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw circuit lines
      lines.forEach(line => {
        line.update();
        line.draw(ctx);
      });

      // Draw particles
      particles.forEach(particle => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
      });

      // Draw connections between nearby particles
      if (isActive) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
              ctx.strokeStyle = `rgba(6, 182, 212, ${0.2 * (1 - distance / 150)})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [isActive]);

  return (
    <>
      {/* Canvas for animated effects */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.6 }}
      />

      {/* Static grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-cyan-500/30" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-cyan-500/30" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-cyan-500/30" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-cyan-500/30" />

      {/* Center glow when active */}
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
        </div>
      )}

      {/* Scanning line effect when active */}
      {isActive && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan" />
        </div>
      )}
    </>
  );
}
