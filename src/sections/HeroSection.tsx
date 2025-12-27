import { useState, useCallback, useEffect } from 'react';
import { SparklesSection } from '../components/SparklesSection';
import { TerminalCard } from '../components/TerminalCard';
import { DinoGame } from '../components/DinoGame';

export function HeroSection() {
  const [showGame, setShowGame] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleProfileClick = useCallback(() => {
    // Don't show game on mobile
    if (!isMobile) {
      setShowGame(true);
    }
  }, [isMobile]);

  const handleCloseGame = useCallback(() => {
    setShowGame(false);
  }, []);

  return (
    <SparklesSection
      id="hero"
      className="scroll-section flex justify-center items-center py-6 px-10 min-h-[30vh] relative
        max-md:py-[80px] max-md:px-8
        max-sm:py-[40px] max-sm:px-5 max-sm:min-h-[40vh]
        max-[480px]:py-[10px] max-[480px]:px-4
        max-[360px]:py-8 max-[360px]:px-3"
    >
      {/* Shooting stars background */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <span className="shooting-star star-1" />
        <span className="shooting-star star-2" />
        <span className="shooting-star star-3" />
        <span className="shooting-star star-4" />
      </div>

      {/* Terminal Card */}
      {!showGame && (
        <div className="relative z-[1] w-full flex justify-center">
          <TerminalCard onProfileClick={handleProfileClick} />
        </div>
      )}

      {/* Dino Game - only on desktop */}
      {showGame && !isMobile && (
        <div className="relative z-[1] w-full">
          <DinoGame onClose={handleCloseGame} />
        </div>
      )}
    </SparklesSection>
  );
}

