import { useState } from 'react';

export function CliSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('npx tirthh');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="py-4 px-12 flex justify-center items-center max-sm:py-4 max-sm:px-5 max-[480px]:py-4 max-[480px]:px-4 max-[360px]:px-3">
      <div className="animated-border relative inline-flex items-center gap-4 bg-[rgba(255,255,255,0.03)] border border-transparent rounded overflow-hidden px-4 py-2 transition-all duration-300 hover:bg-[rgba(128,128,128,0.05)] hover:border-[var(--border-color)]
        max-sm:gap-2.5 max-sm:px-3 max-sm:py-2
        max-[480px]:gap-2 max-[480px]:px-2.5 max-[480px]:py-1.5 max-[480px]:flex-wrap max-[480px]:justify-center">
        {/* Shooting star */}
        <span className="shooting-star cli-star" />

        <span className="text-[13px] text-[var(--text-color)] opacity-60 font-medium relative z-[1] max-sm:text-xs max-[480px]:text-[11px]">
          Try it:
        </span>
        <code className="font-mono text-sm text-[var(--text-color)] bg-[rgba(128,128,128,0.1)] px-2.5 py-1 rounded tracking-[0.3px] relative z-[1] max-sm:text-[13px] max-sm:px-2 max-sm:py-[3px] max-[480px]:text-xs max-[480px]:px-1.5 max-[480px]:py-0.5">
          npx tirthh
        </code>
        <button
          onClick={handleCopy}
          className="bg-transparent border-none text-[var(--text-color)] opacity-70 cursor-pointer px-1.5 py-1 rounded transition-all duration-200 flex items-center justify-center relative z-[1] hover:bg-[rgba(128,128,128,0.1)] hover:opacity-100"
          aria-label="Copy"
        >
          <i className={`${copied ? 'fa-solid fa-check' : 'fa-regular fa-copy'} text-sm max-[480px]:text-xs`} />
        </button>
      </div>
    </section>
  );
}
