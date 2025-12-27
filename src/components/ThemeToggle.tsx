import { useTheme } from '../contexts/ThemeContext';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { playOnce } = useAudioPlayer('');

  const handleToggle = () => {
    playOnce('/audio/click.mp3', 0.3);
    toggleTheme();
  };

  return (
    <label className="relative inline-block w-14 h-8 cursor-pointer max-sm:w-12 max-sm:h-7 max-[480px]:w-11 max-[480px]:h-6" aria-label="Toggle theme">
      <input
        type="checkbox"
        checked={theme === 'light'}
        onChange={handleToggle}
        className="opacity-0 w-0 h-0 absolute"
      />
      <span className="absolute top-0 left-0 right-0 bottom-0 bg-[var(--border-color)] rounded-[34px] transition-all duration-[400ms] ease-in-out flex items-center px-1 hover:opacity-90">
        {/* Slider circle */}
        <span
          className={`absolute h-6 w-6 bottom-1 bg-[var(--bg-color)] rounded-full shadow-md transition-all duration-[400ms] ease-in-out max-sm:h-5 max-sm:w-5 max-[480px]:h-4 max-[480px]:w-4 ${
            theme === 'light' ? 'translate-x-6 max-sm:translate-x-5 max-[480px]:translate-x-5' : 'translate-x-0'
          }`}
          style={{ left: '4px' }}
        />
        {/* Sun icon */}
        <svg
          className={`absolute left-[6px] w-[14px] h-[14px] transition-all duration-[400ms] pointer-events-none ${
            theme === 'light' ? 'opacity-100 text-[var(--bg-color)]' : 'opacity-0 text-[var(--text-color)]'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        {/* Moon icon */}
        <svg
          className={`absolute right-[6px] w-[14px] h-[14px] transition-all duration-[400ms] pointer-events-none ${
            theme === 'light' ? 'opacity-0' : 'opacity-100 text-[var(--bg-color)]'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
    </label>
  );
}
