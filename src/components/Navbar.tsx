import { useRef, useState } from 'react';
import { useClock } from '../hooks/useClock';
import { useSparkles } from '../hooks/useSparkles';
import { ThemeToggle } from './ThemeToggle';
import { SocialLink } from './SocialLink';

export function Navbar() {
  const time = useClock();
  const navRef = useRef<HTMLElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useSparkles(navRef, {
    minSize: 0.4,
    maxSize: 1,
    particleDensity: 1500,
    particleColor: '#FFFFFF',
    opacity: 0.4,
  });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close menu when clicking a link
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      ref={navRef}
      id="navbar"
      className="relative flex justify-between items-center px-12 h-20 bg-[var(--bg-color)] transition-colors duration-300 overflow-visible
        after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:-translate-x-1/2 after:w-screen after:border-b after:border-dashed after:border-[var(--edge)] after:h-0 after:pointer-events-none after:z-[1] after:transition-colors after:duration-300
        md:px-12 md:h-20
        max-md:px-5 max-md:h-[70px]
        max-sm:px-4 max-sm:h-[60px]"
    >
      {/* Left side - Clock */}
      <div className="relative z-[2] flex items-center">
        <div className="flex flex-col items-start gap-0.5">
          <div className="text-lg font-normal text-[var(--text-color)] font-sans tracking-[0.5px] max-md:text-base max-sm:text-sm">
            {time || '12:00:00 PM'}
          </div>
          <div className="text-[11px] font-normal text-[var(--text-color)] opacity-60 tracking-[0.3px] max-md:text-[10px] max-sm:text-[9px]">
            GMT + 5 : 30 • Mumbai, India
          </div>
        </div>
      </div>

      {/* Hamburger Menu Button - Only visible on mobile */}
      <button
        onClick={toggleMobileMenu}
        className="hidden max-sm:flex relative z-[12] flex-col justify-center items-center w-10 h-10 p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] transition-all duration-300 hover:bg-[rgba(128,128,128,0.08)]"
        aria-label="Toggle navigation menu"
        aria-expanded={isMobileMenuOpen}
      >
        <span
          className={`block w-5 h-0.5 bg-[var(--text-color)] rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[3px]' : ''
            }`}
        />
        <span
          className={`block w-5 h-0.5 bg-[var(--text-color)] rounded-full transition-all duration-300 mt-1 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[3px]' : ''
            }`}
        />
      </button>

      {/* Desktop Navigation - Hidden on mobile */}
      <div className="relative z-[2] flex items-center gap-4 max-sm:hidden">
        <ThemeToggle />
        <SocialLink
          href="https://github.com/TirthDhandhukia30"
          icon="fa-brands fa-github"
          label="Github"
          tooltip="@TirthDhandhukia30"
          showLabel={true}
        />
        <SocialLink
          href="https://www.linkedin.com/in/tirthdhandhukia/"
          icon="fa-brands fa-linkedin"
          label="Linkedin"
          tooltip="@tirthdhandhukia"
          showLabel={true}
        />
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[8] transition-opacity duration-300 sm:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Navigation Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-[var(--bg-color)] border-l border-[var(--border-color)] z-[10] transition-transform duration-300 ease-out sm:hidden shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
            <span className="text-xs font-semibold text-[var(--text-color)] opacity-50 uppercase tracking-[0.15em]">Navigation</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[rgba(128,128,128,0.1)] transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-4 h-4 text-[var(--text-color)] opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 p-5 space-y-6">
            {/* Theme Section */}
            <div className="space-y-3">
              <span className="text-[10px] font-semibold text-[var(--text-color)] opacity-40 uppercase tracking-[0.2em]">Appearance</span>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(128,128,128,0.05)] border border-[var(--border-color)]">
                <span className="text-sm text-[var(--text-color)] opacity-80 flex-1">Theme</span>
                <ThemeToggle />
              </div>
            </div>

            {/* Links Section */}
            <div className="space-y-3">
              <span className="text-[10px] font-semibold text-[var(--text-color)] opacity-40 uppercase tracking-[0.2em]">Connect</span>
              <div className="flex flex-col gap-2" onClick={handleLinkClick}>
                <SocialLink
                  href="https://github.com/TirthDhandhukia30"
                  icon="fa-brands fa-github"
                  label="Github"
                  tooltip="@TirthDhandhukia30"
                  showLabel={true}
                />
                <SocialLink
                  href="https://www.linkedin.com/in/tirthdhandhukia/"
                  icon="fa-brands fa-linkedin"
                  label="Linkedin"
                  tooltip="@tirthdhandhukia"
                  showLabel={true}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-[var(--border-color)]">
            <p className="text-[10px] text-[var(--text-color)] opacity-30 text-center tracking-wide">
              © 2024 Tirth Dhandhukia
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
