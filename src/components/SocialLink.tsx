interface SocialLinkProps {
  href: string;
  icon: string;
  label: string;
  tooltip?: string;
  showLabel?: boolean;
}

export function SocialLink({ href, icon, label, tooltip, showLabel = true }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-tooltip={tooltip}
      className="inline-flex items-center gap-2.5 px-4 py-2 bg-transparent text-[var(--text-color)] border border-[var(--border-color)] opacity-80 rounded transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:opacity-100 hover:bg-[rgba(128,128,128,0.08)] hover:-translate-y-px focus:opacity-100 focus:bg-[rgba(128,128,128,0.08)] focus:outline-none focus-visible:outline-2 focus-visible:outline-[rgba(255,255,255,0.6)] focus-visible:outline-offset-2
        max-md:px-3 max-md:py-1.5 max-md:gap-2"
    >
      <i className={`${icon} text-base flex-shrink-0 max-md:text-sm`} />
      {showLabel && <span className="text-sm font-medium tracking-[0.01em] max-md:text-xs whitespace-nowrap">{label}</span>}
    </a>
  );
}

