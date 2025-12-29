import React from 'react';
import { cn } from '../utils/cn';

interface TestimonialProps {
  className?: string;
  children: React.ReactNode;
}

export function Testimonial({ className, children }: TestimonialProps) {
  return (
    <div className={cn('flex h-full min-h-[180px] flex-col justify-between p-4 bg-[var(--card-bg)] rounded-xl border border-white/10 dark:border-white/10 hover:border-white/15 dark:hover:border-white/15 transition-all duration-200', className)}>
      {children}
    </div>
  );
}

interface TestimonialQuoteProps {
  className?: string;
  children: React.ReactNode;
}

export function TestimonialQuote({ className, children }: TestimonialQuoteProps) {
  return (
    <div className={cn('mb-1 flex-1', className)}>
      {children}
    </div>
  );
}

interface TestimonialAuthorProps {
  className?: string;
  children: React.ReactNode;
}

export function TestimonialAuthor({ className, children }: TestimonialAuthorProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {children}
    </div>
  );
}

interface TestimonialAuthorInfoProps {
  className?: string;
  children: React.ReactNode;
}

export function TestimonialAuthorInfo({ className, children }: TestimonialAuthorInfoProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      {children}
    </div>
  );
}

interface TestimonialAuthorNameProps {
  className?: string;
  children: React.ReactNode;
}

export function TestimonialAuthorName({ className, children }: TestimonialAuthorNameProps) {
  return (
    <div className={cn('flex items-center gap-1.5 text-sm font-semibold text-[var(--text-color)] leading-tight', className)}>
      {children}
    </div>
  );
}

interface TestimonialAuthorTaglineProps {
  className?: string;
  children: React.ReactNode;
}

export function TestimonialAuthorTagline({ className, children }: TestimonialAuthorTaglineProps) {
  return (
    <div className={cn('text-xs text-[var(--text-muted)] leading-tight mt-0.5', className)}>
      {children}
    </div>
  );
}

interface TestimonialAvatarProps {
  className?: string;
  children: React.ReactNode;
}

export function TestimonialAvatar({ className, children }: TestimonialAvatarProps) {
  return (
    <div className={cn('relative flex-shrink-0', className)}>
      {children}
    </div>
  );
}

interface TestimonialAvatarImgProps {
  src: string;
  alt?: string;
  className?: string;
}

export function TestimonialAvatarImg({ src, alt = '', className }: TestimonialAvatarImgProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn('h-10 w-10 rounded-full object-cover flex-shrink-0', className)}
    />
  );
}

interface TestimonialAvatarRingProps {
  className?: string;
}

export function TestimonialAvatarRing(_: TestimonialAvatarRingProps) {
  return null; // Removed ring for cleaner Twitter/X style
}

interface TestimonialVerifiedBadgeProps {
  className?: string;
}

export function TestimonialVerifiedBadge({ className }: TestimonialVerifiedBadgeProps) {
  return (
    <svg
      className={cn('h-3.5 w-3.5 text-blue-500 flex-shrink-0', className)}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

