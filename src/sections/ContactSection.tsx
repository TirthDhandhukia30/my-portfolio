import { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, runTransaction } from 'firebase/database';
import { SparklesSection } from '../components/SparklesSection';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

const firebaseConfig = {
  apiKey: "AIzaSyDOxmydsSlH38n_azv2E_uQlKgkRHqQb60",
  authDomain: "protfolio-web-114ac.firebaseapp.com",
  databaseURL: "https://protfolio-web-114ac-default-rtdb.firebaseio.com/",
  projectId: "protfolio-web-114ac",
  storageBucket: "protfolio-web-114ac.appspot.com",
  messagingSenderId: "902889170627",
  appId: "1:902889170627:web:36871543c6fbe5af3c6476",
  measurementId: "G-E1HHJVKCQ5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export function ContactSection() {
  const [count, setCount] = useState(0);
  const { playOnce } = useAudioPlayer('');

  useEffect(() => {
    const countRef = ref(db, 'clickCount');
    const unsubscribe = onValue(countRef, (snapshot) => {
      const val = snapshot.val();
      setCount(val ?? 0);
    });
    return () => unsubscribe();
  }, []);

  const handleClick = useCallback(() => {
    const countRef = ref(db, 'clickCount');
    runTransaction(countRef, (current) => (current || 0) + 1);
    playOnce('/audio/click.mp3', 0.3);
  }, [playOnce]);

  const handleBackToTop = () => {
    playOnce('/audio/click.mp3', 0.3);
    document.getElementById('name')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <SparklesSection
      id="contact"
      className="scroll-section py-[80px] px-6 flex flex-col items-center gap-12 bg-[var(--bg-color)] relative transition-colors duration-300
        before:content-[''] before:absolute before:left-1/2 before:top-0 before:-translate-x-1/2 before:w-screen before:border-t before:border-dashed before:border-[var(--edge)] before:h-0 before:pointer-events-none before:z-0 before:transition-colors before:duration-300
        max-md:py-[80px] max-md:px-8
        max-sm:py-[50px] max-sm:px-5 max-sm:gap-8
        max-[480px]:py-14 max-[480px]:px-4 max-[480px]:gap-7
        max-[360px]:py-[40px] max-[360px]:px-3"
    >
      <h2 className="text-left text-[1.5rem] font-semibold m-0 mb-8 tracking-[-0.02em] text-[var(--text-color)] max-md:text-[32px] max-sm:text-[1.75rem] max-[480px]:text-[2rem] max-[360px]:text-[1.75rem]">
        Let's connect!
      </h2>

      <div className="max-w-[680px] text-center">
        <p className="text-[var(--text-color)] text-base leading-[1.8] mb-6 opacity-80 max-sm:text-[0.95rem] max-sm:leading-[1.7] max-sm:mb-5 max-[480px]:text-[0.9375rem] max-[480px]:mb-4 max-[360px]:text-[0.875rem]">
          Appreciate you stopping by. If a project sparked something or you just want to jam on builds, drop me a line.
        </p>
        <p className="text-[var(--text-color)] text-[1.1rem] font-semibold mt-8 opacity-100 max-sm:text-base max-[480px]:text-base max-[480px]:mt-6">
          Always keen to collaborate, learn, and ship new ideas.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-5 items-center flex-wrap justify-center">
        <a
          href="#"
          data-cal-link="tirthhh/15min"
          data-cal-namespace="15min"
          data-cal-config='{"layout":"month_view"}'
          className="animated-border relative inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[var(--bg-color)] text-[var(--text-color)] border border-transparent rounded text-[15px] font-medium no-underline transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden
            hover:text-[var(--bg-color)] hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(128,128,128,0.3)]
            [&:hover::after]:opacity-100
            after:content-[''] after:absolute after:inset-0 after:bg-[var(--text-color)] after:opacity-0 after:transition-opacity after:duration-300 after:rounded after:z-0
            max-sm:w-full max-sm:max-w-[320px] max-sm:text-sm max-sm:px-5 max-sm:py-3
            max-[480px]:max-w-full max-[480px]:text-[13px] max-[480px]:px-[18px] max-[480px]:py-[11px]"
        >
          <i className="fa-solid fa-calendar relative z-[1] text-base max-[480px]:text-sm" />
          <span className="relative z-[1]">Book a Call</span>
        </a>

        <a
          href="/Portfolio_resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="animated-border relative inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[var(--bg-color)] text-[var(--text-color)] border border-transparent rounded text-[15px] font-medium no-underline transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden
            hover:text-[var(--bg-color)] hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(128,128,128,0.3)]
            [&:hover::after]:opacity-100
            after:content-[''] after:absolute after:inset-0 after:bg-[var(--text-color)] after:opacity-0 after:transition-opacity after:duration-300 after:rounded after:z-0
            max-sm:w-full max-sm:max-w-[320px] max-sm:text-sm max-sm:px-5 max-sm:py-3
            max-[480px]:max-w-full max-[480px]:text-[13px] max-[480px]:px-[18px] max-[480px]:py-[11px]"
        >
          <i className="fa-solid fa-file-pdf relative z-[1] text-base max-[480px]:text-sm" />
          <span className="relative z-[1]">Resume</span>
        </a>
      </div>

      {/* Quote */}
      <div className="mt-12 max-w-[700px] text-center max-sm:mt-10 max-[480px]:mt-8 max-[360px]:mt-[25px]">
        <p className="text-[1.125rem] leading-relaxed text-[var(--text-color)] opacity-50 italic font-normal tracking-[0.01em] max-sm:text-base max-[480px]:text-[0.9375rem] max-[360px]:text-[0.875rem]">
          "Every vision deserves to be built into reality."
        </p>
      </div>

      {/* Footer Section */}
      <div className="flex justify-center items-center flex-wrap gap-4 mt-10 max-md:gap-3.5 max-md:mt-8 max-sm:gap-3 max-sm:mt-7 max-sm:flex-row max-sm:w-full max-[480px]:gap-2.5 max-[480px]:mt-6 max-[480px]:px-4 max-[360px]:gap-2 max-[360px]:mt-6 max-[360px]:px-3">
        {/* Back to Top */}
        <div className="flex justify-center items-center">
          <button
            onClick={handleBackToTop}
            className="inline-flex flex-col items-center gap-1.5 px-5 py-3 bg-[rgba(128,128,128,0.05)] border border-[var(--border-color)] opacity-70 rounded-3xl text-[var(--text-color)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] no-underline cursor-pointer w-[140px] min-h-[84px] justify-center
              hover:bg-[rgba(128,128,128,0.1)] hover:opacity-100 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(128,128,128,0.2)]
              max-sm:px-4 max-sm:py-2.5 max-sm:gap-[5px]
              max-[480px]:px-3.5 max-[480px]:py-2.5 max-[480px]:gap-1"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[var(--border-color)] opacity-80 bg-transparent text-[var(--text-color)] text-[15px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
              max-sm:w-[26px] max-sm:h-[26px] max-sm:text-[13px]
              max-[480px]:w-7 max-[480px]:h-7 max-[480px]:text-sm
              max-[360px]:w-[26px] max-[360px]:h-[26px] max-[360px]:text-[13px]"
            >
              <i className="fa-solid fa-arrow-up" />
            </span>
            <span className="text-[11px] text-[var(--text-color)] opacity-40 lowercase tracking-[0.05em] font-medium max-sm:text-[9px] max-[480px]:text-[10px] max-[360px]:text-[9px]">
              back to top
            </span>
          </button>
        </div>

        {/* Clicker */}
        <div
          onClick={handleClick}
          className="inline-flex flex-col items-center gap-1.5 px-5 py-3 bg-[rgba(128,128,128,0.05)] border border-[var(--border-color)] opacity-70 rounded-3xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer w-[140px] min-h-[84px] justify-center
            hover:bg-[rgba(128,128,128,0.1)] hover:opacity-100 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(128,128,128,0.2)]
            max-sm:px-4 max-sm:py-2.5 max-sm:gap-[5px]
            max-[480px]:px-3.5 max-[480px]:py-2 max-[480px]:gap-1
            max-[360px]:px-3.5 max-[360px]:py-2 max-[360px]:gap-1"
        >
          <div className="flex items-center gap-2 justify-center max-sm:gap-1.5 max-[480px]:gap-1.5 max-[360px]:gap-1.5">
            <span className="text-[var(--text-color)] text-[15px] max-sm:text-sm max-[480px]:text-[13px] max-[360px]:text-[13px]">
              <i className="fa-solid fa-hands-clapping" />
            </span>
            <span className="text-sm font-semibold text-[var(--text-color)] opacity-90 min-w-[20px] text-center tabular-nums max-sm:text-[13px] max-[480px]:text-xs max-[360px]:text-xs">
              {count}
            </span>
          </div>
          <span className="text-[11px] text-[var(--text-color)] opacity-40 lowercase tracking-[0.05em] font-medium max-sm:text-[9px] max-[480px]:text-[10px] max-[360px]:text-[9px]">
            appreciate ?
          </span>
        </div>
      </div>
    </SparklesSection>
  );
}
