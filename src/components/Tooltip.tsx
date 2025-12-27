import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

interface TooltipState {
  visible: boolean;
  content: string;
  x: number;
  y: number;
}

export function TooltipProvider() {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    content: '',
    x: 0,
    y: 0,
  });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    const offset = 8;
    const zoom = 0.85; // Match the zoom factor from index.css
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    // Compensate for page zoom
    let x = clientX / zoom + offset;
    let y = clientY / zoom + offset;

    if (x + rect.width / zoom > window.innerWidth / zoom) {
      x = clientX / zoom - rect.width / zoom - offset;
    }

    if (y + rect.height / zoom > window.innerHeight / zoom) {
      y = clientY / zoom - rect.height / zoom - offset;
    }

    setTooltip((prev) => ({ ...prev, x, y }));
  }, []);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-tooltip]');
      if (target) {
        const content = target.getAttribute('data-tooltip');
        if (content) {
          setTooltip({
            visible: true,
            content,
            x: e.clientX / 0.85 + 8,
            y: e.clientY / 0.85 + 8,
          });
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-tooltip]');
      if (target) {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (tooltip.visible) {
        updatePosition(e.clientX, e.clientY);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [tooltip.visible, updatePosition]);

  const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';

  return createPortal(
    <div
      ref={containerRef}
      className={`fixed z-[9999] pointer-events-none transition-opacity duration-200 max-w-[300px] px-3 py-2 rounded text-[13px] font-medium whitespace-nowrap shadow-lg backdrop-blur-[10px] ${theme === 'light'
        ? 'bg-white/95 text-[rgba(45,45,45,0.9)] border border-black/10'
        : 'bg-black/90 text-[rgba(255,255,255,0.9)] border border-white/10'
        }`}
      style={{
        opacity: tooltip.visible ? 1 : 0,
        left: tooltip.x,
        top: tooltip.y,
      }}
    >
      {tooltip.content}
    </div>,
    document.body
  );
}
