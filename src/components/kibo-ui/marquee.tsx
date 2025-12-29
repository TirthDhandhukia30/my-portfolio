import React from 'react';
import ReactFastMarquee from 'react-fast-marquee';
import { cn } from '@/utils/cn';

interface MarqueeProps extends React.ComponentProps<typeof ReactFastMarquee> {
  className?: string;
  children: React.ReactNode;
}

export function Marquee({ className, children, ...props }: MarqueeProps) {
  return (
    <div className="relative w-full overflow-hidden">
      <ReactFastMarquee className={cn('', className)} {...props}>
        {children}
      </ReactFastMarquee>
    </div>
  );
}

interface MarqueeContentProps {
  className?: string;
  children: React.ReactNode;
}

export function MarqueeContent({ className, children }: MarqueeContentProps) {
  return <div className={cn('flex', className)}>{children}</div>;
}

interface MarqueeItemProps {
  className?: string;
  children: React.ReactNode;
}

export function MarqueeItem({ className, children }: MarqueeItemProps) {
  return <div className={cn('flex-shrink-0', className)}>{children}</div>;
}

interface MarqueeFadeProps {
  side?: 'left' | 'right';
  className?: string;
}

export function MarqueeFade({ side = 'left', className }: MarqueeFadeProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute top-0 z-10 h-full w-20',
        side === 'left' ? 'left-0 bg-gradient-to-r from-[var(--bg-color)] to-transparent' : 'right-0 bg-gradient-to-l from-[var(--bg-color)] to-transparent',
        className
      )}
    />
  );
}

