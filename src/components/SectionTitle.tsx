interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  withPadding?: boolean;
}

export function SectionTitle({ children, className = '', withPadding = false }: SectionTitleProps) {
  return (
    <div className={`max-w-[700px] mx-auto ${withPadding ? 'px-6 max-md:px-8 max-sm:px-5 max-[480px]:px-4 max-[360px]:px-3' : ''}`}>
      <h2 className={`text-2xl font-semibold mb-4 text-[var(--text-color)] tracking-[-0.025em] ${className}`}>
        {children}
      </h2>
    </div>
  );
}
