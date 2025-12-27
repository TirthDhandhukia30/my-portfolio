import { useRef } from 'react';
import { useSparkles } from '../hooks/useSparkles';

const FOOTER_LINKS = [
  { href: 'mailto:tirth30.info@gmail.com', icon: 'fa-solid fa-envelope', label: 'Mail', tooltip: 'tirth30.info@gmail.com' },
  { href: 'https://github.com/TirthDhandhukia30', icon: 'fa-brands fa-github', label: 'Github', tooltip: '@TirthDhandhukia30' },
  { href: 'https://twitter.com/Tirthhh30', icon: 'fa-brands fa-x-twitter', label: 'Twitter', tooltip: '@Tirthhh30' },
  { href: 'https://www.linkedin.com/in/tirthdhandhukia/', icon: 'fa-brands fa-linkedin', label: 'LinkedIn', tooltip: '@tirthdhandhukia' },
  { href: 'https://leetcode.com/u/TirthDhandhukia/', icon: 'fa-solid fa-code', label: 'LeetCode', tooltip: '@TirthDhandhukia' },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useSparkles(footerRef, {
    minSize: 0.4,
    maxSize: 1,
    particleDensity: 1200,
    particleColor: '#FFFFFF',
    opacity: 0.5,
  });

  return (
    <footer
      ref={footerRef}
      id="siteFooter"
      className="footer-container"
    >
      {/* Links Section - Positioned above the giant name effect */}
      <div className="footer-content">
        {/* Links */}
        <div className="footer-links">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              data-tooltip={link.tooltip}
              className="footer-link"
            >
              <i className={`${link.icon} footer-link-icon`} />
              <span>{link.label}</span>
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p>© 2025 Tirth Dhandhukia. All rights reserved.</p>
        </div>
      </div>

      {/* Giant Name Effect Section */}
      <div className="footer-name-section">
        {/* The large name text */}
        <span className="footer-name-text">
          TIRTH
        </span>

        {/* Dotted grid overlay effect */}
        <div className="footer-grid" />

        {/* Gradient fade overlay */}
        <div className="footer-gradient" />
      </div>
    </footer>
  );
}
