import { useEffect, useRef, useCallback } from 'react';


interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  phase: number;
  twinkleSpeed: number;
}

interface SparklesOptions {
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
  opacity?: number;
}

export function useSparkles(containerRef: React.RefObject<HTMLElement | null>, options: SparklesOptions = {}) {
  const {
    minSize = 0.4,
    maxSize = 1,
    particleDensity = 1200,
    particleColor = '#FFFFFF',
    opacity = 0.5,
  } = options;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();


  const hexToRgba = useCallback((hex: string, alpha: number): string => {
    if (hex.startsWith('#')) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `rgba(255, 255, 255, ${alpha})`;
  }, []);

  const createParticles = useCallback((width: number, height: number) => {
    const area = width * height;
    const count = Math.floor(area / particleDensity);
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: minSize + Math.random() * (maxSize - minSize),
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.5,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    return particles;
  }, [particleDensity, minSize, maxSize]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.className = 'sparkles-canvas';
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    canvas.style.opacity = String(opacity);

    container.style.position = 'relative';
    container.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      particlesRef.current = createParticles(rect.width, rect.height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Update twinkle
        particle.phase += particle.twinkleSpeed;
        const twinkle = (Math.sin(particle.phase) + 1) / 2;
        const particleOpacity = particle.opacity * twinkle;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

        const color = currentTheme === 'light'
          ? hexToRgba('#2d2d2d', particleOpacity)
          : hexToRgba(particleColor, particleOpacity);

        ctx.fillStyle = color;
        ctx.fill();

        // Add glow for bright particles
        if (twinkle > 0.7) {
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3
          );

          if (currentTheme === 'light') {
            gradient.addColorStop(0, hexToRgba('#2d2d2d', particleOpacity * 0.6));
            gradient.addColorStop(1, hexToRgba('#2d2d2d', 0));
          } else {
            gradient.addColorStop(0, hexToRgba(particleColor, particleOpacity * 0.5));
            gradient.addColorStop(1, hexToRgba(particleColor, 0));
          }

          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, [containerRef, opacity, particleColor, createParticles, hexToRgba]);

  return canvasRef;
}
