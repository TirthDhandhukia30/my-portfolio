import { useRoleAnimation } from '../hooks/useRoleAnimation';
import { IconButton } from './IconButton';

interface TerminalCardProps {
  onProfileClick: () => void;
}

export function TerminalCard({ onProfileClick }: TerminalCardProps) {
  const { currentRole, animationClass } = useRoleAnimation();

  return (
    <div
      id="terminalCard"
      className="relative w-full max-w-[700px] bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[5px] p-8 overflow-hidden z-[1] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        max-md:max-w-[650px]
        max-sm:p-6 max-sm:max-w-full
        max-[480px]:p-5 max-[480px]:rounded
        max-[360px]:p-4"
    >
      {/* Corner Highlights */}
      <div className="absolute w-3 h-3 border border-[var(--border-color)] top-[-1px] left-[-1px] border-r-0 border-b-0 transition-colors duration-300 max-[480px]:w-2.5 max-[480px]:h-2.5" />
      <div className="absolute w-3 h-3 border border-[var(--border-color)] top-[-1px] right-[-1px] border-l-0 border-b-0 transition-colors duration-300 max-[480px]:w-2.5 max-[480px]:h-2.5" />
      <div className="absolute w-3 h-3 border border-[var(--border-color)] bottom-[-1px] left-[-1px] border-r-0 border-t-0 transition-colors duration-300 max-[480px]:w-2.5 max-[480px]:h-2.5" />
      <div className="absolute w-3 h-3 border border-[var(--border-color)] bottom-[-1px] right-[-1px] border-l-0 border-t-0 transition-colors duration-300 max-[480px]:w-2.5 max-[480px]:h-2.5" />

      {/* Shooting stars */}
      <span className="shooting-star terminal-star-1" />
      <span className="shooting-star terminal-star-2" />

      {/* Terminal Header */}
      <div className="flex justify-end items-center mb-8 max-sm:flex-col max-sm:gap-3 max-[480px]:flex-col-reverse max-[480px]:gap-3 max-[480px]:mb-6">
        <div className="flex gap-2 ml-auto max-sm:w-full max-sm:justify-center max-sm:flex-wrap max-sm:ml-0">
          <IconButton href="https://twitter.com/Tirthhh30" icon="fa-brands fa-x-twitter" ariaLabel="Twitter" />
          <IconButton href="https://leetcode.com/u/TirthDhandhukia/" icon="fa-solid fa-code" ariaLabel="LeetCode" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 items-start mb-8 max-[480px]:gap-4 max-[480px]:items-center">
        {/* Profile Image */}
        <div
          className="flex-shrink-0 cursor-pointer relative inline-block"
          onClick={onProfileClick}
        >
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[var(--text-color)] font-sans text-[11px] tracking-[0.2px] lowercase py-[3px] px-[9px] rounded-full opacity-65 flex items-center gap-1 whitespace-nowrap game-hint-label max-sm:hidden">
            <svg
              className="hint-arrow w-3.5 h-3.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
            click me
          </div>
          <img
            src="/images/pfp.jpg"
            alt="Tirth Dhandhukia"
            className="w-[120px] h-[120px] border border-[var(--border-color)] rounded object-cover bg-[var(--bg-color)] transition-colors duration-300
              max-sm:w-[100px] max-sm:h-[100px]
              max-[480px]:w-[90px] max-[480px]:h-[90px]"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 flex flex-col gap-2 pt-1">
          <div className="flex items-center gap-4 max-[480px]:gap-2">
            <h1 className="text-[32px] font-bold text-[var(--text-color)] m-0 leading-none tracking-[-0.02em] inline-flex items-center gap-2 whitespace-nowrap
              max-md:text-[32px]
              max-sm:text-[28px]
              max-[480px]:text-xl
              max-[360px]:text-lg"
            >
              Tirth Dhandhukia
              <svg
                className="w-6 h-6 flex-shrink-0 mt-0.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#1DA1F2"
              >
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5c-1.51 0-2.818.915-3.437 2.25-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.51 0 2.817-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
              </svg>
            </h1>
          </div>
          <p className="text-sm font-normal text-[var(--text-color)] mt-1 opacity-70 min-h-[20px] max-sm:text-[15px] max-[480px]:text-sm" aria-live="polite">
            <span className={`${animationClass} inline-flex items-center gap-1.5 opacity-90 transition-colors duration-300`}>
              {currentRole}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm text-[var(--text-color)] mt-1 opacity-90 max-sm:text-[13px] max-[480px]:text-xs">
            <i className="fa-solid fa-envelope text-[13px]" />
            <span>tirth30.info@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="text-center text-sm leading-relaxed text-[var(--text-color)] opacity-70 max-w-[90%] mx-auto font-normal max-sm:text-[13px] max-sm:max-w-full max-[480px]:text-xs">
        I make things that work. Sometimes they matter. Now exploring Web3.
      </div>
    </div>
  );
}
