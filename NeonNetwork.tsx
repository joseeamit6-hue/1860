import React, { useEffect, useRef } from "react";

interface NeonNetworkProps {
  isDarkMode: boolean;
}

export const NeonNetwork: React.FC<NeonNetworkProps> = ({ isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2 + 1;

        // Neon palette
        const colors = isDarkMode
          ? ["rgba(34, 211, 238, 0.7)", "rgba(168, 85, 247, 0.7)", "rgba(59, 130, 246, 0.7)"]
          : ["rgba(6, 182, 212, 0.5)", "rgba(147, 51, 234, 0.5)", "rgba(37, 99, 235, 0.5)"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.shadowBlur = isDarkMode ? 6 : 2;
        c.shadowColor = this.color;
        c.fill();
      }
    }

    let particles: Particle[] = [];
    const particleCount = Math.min(Math.floor((width * height) / 12000), 80);

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const drawConnections = (c: CanvasRenderingContext2D) => {
      const maxDistance = 140;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isDarkMode ? 0.25 : 0.15);
            c.beginPath();
            c.moveTo(particles[i].x, particles[i].y);
            c.lineTo(particles[j].x, particles[j].y);

            // Create beautiful neon gradient connecting lines
            const gradient = c.createLinearGradient(
              particles[i].x,
              particles[i].y,
              particles[j].x,
              particles[j].y
            );
            gradient.addColorStop(0, particles[i].color.replace(/[\d.]+\)$/, `${alpha})`));
            gradient.addColorStop(1, particles[j].color.replace(/[\d.]+\)$/, `${alpha})`));

            c.strokeStyle = gradient;
            c.lineWidth = 1;
            c.shadowBlur = 0; // Turn off line shadow for better FPS
            c.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Render background base
      ctx.fillStyle = isDarkMode ? "#030712" : "#f9fafb";
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      drawConnections(ctx);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = [];
      const newCount = Math.min(Math.floor((width * height) / 12000), 80);
      for (let i = 0; i < newCount; i++) {
        particles.push(new Particle());
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none transition-colors duration-500"
    />
  );
};
