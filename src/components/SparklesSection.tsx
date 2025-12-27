import { useRef, ReactNode } from 'react';
import { useSparkles } from '../hooks/useSparkles';

interface SparklesSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function SparklesSection({ children, className = '', id }: SparklesSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  useSparkles(containerRef, {
    minSize: 0.4,
    maxSize: 1,
    particleDensity: 1200,
    particleColor: '#FFFFFF',
    opacity: 0.5,
  });

  return (
    <section ref={containerRef} id={id} className={`relative overflow-hidden ${className}`}>
      {children}
    </section>
  );
}
