import { useRef, useEffect, useCallback, useState } from 'react';

interface DinoGameProps {
  onClose: () => void;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'cactus' | 'bird';
  speedOffset: number;
}

export function DinoGame({ onClose }: DinoGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [hiScore, setHiScore] = useState(() => parseInt(localStorage.getItem('dinoHiScore') || '0'));
  
  const gameStateRef = useRef({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    currentSpeed: 6,
    framesUntilNextSpawn: 70,
    dino: { x: 50, y: 150, width: 40, height: 45, dy: 0, jumping: false },
    obstacles: [] as Obstacle[],
  });

  const gameSoundRef = useRef<HTMLAudioElement | null>(null);

  // Constants
  const GRAVITY = 0.6;
  const JUMP_STRENGTH = -12;
  const BASE_SPEED = 6;
  const MAX_SPEED = 11.5;
  const SPEED_STEP = 0.5;
  const DIFFICULTY_INTERVAL = 50;
  const SPAWN_INTERVAL_MIN = 70;
  const SPAWN_INTERVAL_MAX = 120;
  const ENABLE_BIRD_SCORE = 80;

  const getDisplayScore = useCallback(() => Math.floor(gameStateRef.current.score / 10), []);

  const randomSpawnInterval = useCallback(() => {
    const scoreFactor = getDisplayScore();
    const difficultyMultiplier = Math.min(1.8, 1 + scoreFactor / 120);
    const minInterval = Math.max(45, Math.floor(SPAWN_INTERVAL_MIN / difficultyMultiplier));
    const maxInterval = Math.max(minInterval + 15, Math.floor(SPAWN_INTERVAL_MAX / difficultyMultiplier));
    return Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
  }, [getDisplayScore]);

  const spawnObstacle = useCallback(() => {
    const state = gameStateRef.current;
    const allowBirds = getDisplayScore() >= ENABLE_BIRD_SCORE;
    const types: ('cactus' | 'bird')[] = allowBirds ? ['cactus', 'bird'] : ['cactus'];
    const type = types[Math.floor(Math.random() * types.length)];

    const canvas = canvasRef.current;
    if (!canvas) return;

    state.obstacles.push({
      x: canvas.width,
      y: type === 'cactus' ? 155 : 130,
      width: 20,
      height: type === 'cactus' ? 40 : 30,
      type,
      speedOffset: type === 'bird' ? 0.8 : 0,
    });
  }, [getDisplayScore]);

  const jump = useCallback(() => {
    const state = gameStateRef.current;

    if (state.isGameOver) {
      // Reset game
      state.obstacles = [];
      state.score = 0;
      state.isGameOver = false;
      state.dino.y = 150;
      state.dino.dy = 0;
      state.dino.jumping = false;
      state.currentSpeed = BASE_SPEED;
      state.framesUntilNextSpawn = randomSpawnInterval();
      state.isPlaying = true;
      return;
    }

    if (!state.isPlaying) return;

    if (!state.dino.jumping) {
      state.dino.dy = JUMP_STRENGTH;
      state.dino.jumping = true;

      if (gameSoundRef.current) {
        gameSoundRef.current.currentTime = 0;
        gameSoundRef.current.play().catch(() => {});
      }
    }
  }, [randomSpawnInterval]);

  const adjustCanvasWidth = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const containerWidth = container.clientWidth;
    const horizontalPadding = 32;
    const rawTargetWidth = containerWidth - horizontalPadding;
    const targetWidth = Math.max(360, Math.min(600, rawTargetWidth));
    if (canvas.width !== targetWidth) {
      canvas.width = targetWidth;
    }
  }, []);

  useEffect(() => {
    gameSoundRef.current = new Audio('/audio/game.mp3');
    gameSoundRef.current.volume = 0.4;

    // Show animation
    const timer = setTimeout(() => setIsVisible(true), 10);

    // Start game
    const state = gameStateRef.current;
    state.isPlaying = true;
    state.isGameOver = false;

    adjustCanvasWidth();
    window.addEventListener('resize', adjustCanvasWidth);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Game loop
    let animationId: number;

    const gameLoop = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx || !state.isPlaying) return;

      // Update physics
      state.dino.dy += GRAVITY;
      state.dino.y += state.dino.dy;

      if (state.dino.y >= 150) {
        state.dino.y = 150;
        state.dino.dy = 0;
        state.dino.jumping = false;
      }

      // Move obstacles
      state.obstacles.forEach((obstacle) => {
        obstacle.x -= state.currentSpeed + (obstacle.speedOffset || 0);
      });

      // Remove off-screen
      state.obstacles = state.obstacles.filter((o) => o.x + o.width > 0);

      // Spawn new
      state.framesUntilNextSpawn -= 1;
      if (state.framesUntilNextSpawn <= 0) {
        spawnObstacle();
        state.framesUntilNextSpawn = randomSpawnInterval();
      }

      // Score
      state.score++;
      const displayScore = Math.floor(state.score / 10);
      setScore(displayScore);

      if (state.score > parseInt(localStorage.getItem('dinoHiScore') || '0')) {
        localStorage.setItem('dinoHiScore', String(state.score));
        setHiScore(Math.floor(state.score / 10));
      }

      // Update difficulty
      const level = Math.floor(displayScore / DIFFICULTY_INTERVAL);
      state.currentSpeed = Math.min(BASE_SPEED + level * SPEED_STEP, MAX_SPEED);

      // Check collisions
      for (const obstacle of state.obstacles) {
        if (
          state.dino.x < obstacle.x + obstacle.width - 10 &&
          state.dino.x + state.dino.width - 10 > obstacle.x &&
          state.dino.y < obstacle.y + obstacle.height - 10 &&
          state.dino.y + state.dino.height - 10 > obstacle.y
        ) {
          state.isGameOver = true;
          state.isPlaying = false;
        }
      }

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const textColor = getComputedStyle(document.body).getPropertyValue('--text-color').trim();
      const bgColor = getComputedStyle(document.body).getPropertyValue('--bg-color').trim();

      // Ground
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 195);
      ctx.lineTo(canvas.width, 195);
      ctx.stroke();

      // Dino
      ctx.fillStyle = textColor;
      ctx.fillRect(state.dino.x, state.dino.y, state.dino.width, state.dino.height);

      // Eye
      ctx.fillStyle = bgColor;
      ctx.fillRect(state.dino.x + 28, state.dino.y + 8, 6, 6);

      // Obstacles
      state.obstacles.forEach((obstacle) => {
        ctx.fillStyle = textColor;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      });

      // Game over text
      if (state.isGameOver) {
        ctx.fillStyle = textColor;
        ctx.font = '20px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, 80);
        ctx.font = '14px Courier New';
        ctx.fillText('Click or Press SPACE to restart', canvas.width / 2, 105);
      }

      if (!state.isGameOver) {
        animationId = requestAnimationFrame(gameLoop);
      }
    };

    gameLoop();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', adjustCanvasWidth);
      document.removeEventListener('keydown', handleKeyDown);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [adjustCanvasWidth, jump, onClose, randomSpawnInterval, spawnObstacle]);

  const handleCanvasClick = () => jump();

  return (
    <div
      ref={containerRef}
      className={`dino-game-container relative flex flex-col items-center justify-center py-12 px-6 w-full max-w-[650px] mx-auto 
        max-sm:py-8 max-sm:px-4
        max-[480px]:py-6 max-[480px]:px-3
        ${isVisible ? 'fade-in' : ''}`}
    >
      <button
        onClick={onClose}
        className="absolute top-[0.2rem] right-4 bg-[rgba(128,128,128,0.08)] border border-[var(--border-color)] text-[var(--text-color)] w-9 h-9 rounded cursor-pointer flex items-center justify-center transition-all duration-200 z-10 opacity-70 hover:bg-[rgba(128,128,128,0.15)] hover:opacity-100 hover:scale-105
          max-sm:w-8 max-sm:h-8 max-sm:right-2 max-sm:top-0
          max-[480px]:w-7 max-[480px]:h-7"
        aria-label="Close game"
      >
        <i className="fa-solid fa-xmark text-lg max-sm:text-base max-[480px]:text-sm" />
      </button>

      <canvas
        ref={canvasRef}
        id="dinoCanvas"
        width={600}
        height={200}
        onClick={handleCanvasClick}
        className="max-w-full"
      />

      <div className="absolute top-14 right-16 font-mono text-[0.9rem] text-[var(--text-color)] flex gap-4 opacity-80
        max-sm:top-10 max-sm:right-8 max-sm:text-xs max-sm:gap-2
        max-[480px]:top-8 max-[480px]:right-4 max-[480px]:text-[11px]">
        <span>HI <span>{String(hiScore).padStart(5, '0')}</span></span>
        <span>{String(score).padStart(5, '0')}</span>
      </div>

      <div className="mt-8 font-mono text-[0.85rem] text-[var(--text-color)] opacity-60
        max-sm:mt-6 max-sm:text-xs
        max-[480px]:mt-4 max-[480px]:text-[11px]">
        Press SPACE or click to jump
      </div>
    </div>
  );
}
