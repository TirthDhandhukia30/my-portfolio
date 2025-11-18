import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import {
  getDatabase,
  ref,
  onValue,
  runTransaction,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Hello Intro Animation
function animateHelloIntro() {
  const svgEl = document.getElementById("helloIntro");
  const overlay = document.getElementById("introOverlay");
  const speed = Number(svgEl.dataset.speed ?? 1);
  const paths = Array.from(svgEl.querySelectorAll("path"));

  if (!paths.length) return;

  // Add intro-active class to body
  document.body.classList.add("intro-active");

  // Prepare each path
  paths.forEach((p) => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
    p.style.opacity = 0;
    p.getBoundingClientRect();
  });

  let finishedCount = 0;
  const totalToFinish = paths.length;

  paths.forEach((p) => {
    const duration = (parseFloat(p.dataset.duration) || 0.6) * 1000 * speed;
    const delay = (parseFloat(p.dataset.delay) || 0) * 1000 * speed;
    const opDur =
      (parseFloat(p.dataset.opacityDuration) ||
        Math.min(0.5, (parseFloat(p.dataset.duration) || 0.6) * 0.5)) *
      1000 *
      speed;
    const opDelay =
      (parseFloat(p.dataset.opacityDelay) || parseFloat(p.dataset.delay) || 0) *
      1000 *
      speed;
    const len = p.getTotalLength();

    // Stroke animation
    const strokeAnim = p.animate(
      [{ strokeDashoffset: String(len) }, { strokeDashoffset: "0" }],
      {
        duration,
        delay,
        easing: "cubic-bezier(.4,0,.2,1)",
      }
    );

    // Opacity animation
    const opacityAnim = p.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: opDur,
      delay: opDelay,
      easing: "linear",
    });

    strokeAnim.onfinish = () => {
      p.style.strokeDashoffset = "0";
    };

    opacityAnim.onfinish = () => {
      p.style.opacity = "1";
      finishedCount += 1;

      if (finishedCount === totalToFinish) {
        // Animation complete - wait 1800ms then fade out
        setTimeout(() => {
          overlay.classList.add("hidden");
          document.body.classList.remove("intro-active");
        }, 1800);
      }
    };
  });
}

// Run intro animation when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", animateHelloIntro);
} else {
  animateHelloIntro();
}

// Game jump sound (global scope)
const gameSound = new Audio("audio/game.mp3");
gameSound.volume = 0.4;

// Theme Toggle
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;
  if (!themeToggle) {
    return;
  }

  let themeTransitionTimeout;
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)");
  const clickSound = new Audio("audio/click.mp3");
  clickSound.volume = 0.3;

  const startThemeTransition = () => {
    body.classList.add("theme-transition");
    clearTimeout(themeTransitionTimeout);
    themeTransitionTimeout = setTimeout(() => {
      body.classList.remove("theme-transition");
    }, 400);
  };

  const applyTheme = (mode, { animate = false, persist = false } = {}) => {
    const shouldUseLight = mode === "light";
    if (animate) {
      startThemeTransition();
    }
    body.classList.toggle("light-theme", shouldUseLight);
    themeToggle.checked = shouldUseLight;

    if (persist) {
      if (shouldUseLight) {
        localStorage.setItem("theme", "light-theme");
      } else {
        localStorage.setItem("theme", "dark-theme");
      }
    }
  };

  const resolveInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light-theme") {
      applyTheme("light");
      return true;
    }
    if (savedTheme === "dark-theme") {
      applyTheme("dark");
      return true;
    }

    applyTheme(prefersLight.matches ? "light" : "dark");
    return false;
  };

  const hasStoredPreference = resolveInitialTheme();

  themeToggle.addEventListener("change", () => {
    const mode = themeToggle.checked ? "light" : "dark";
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
    applyTheme(mode, { animate: true, persist: true });
  });

  if (!hasStoredPreference) {
    prefersLight.addEventListener("change", (event) => {
      if (!localStorage.getItem("theme")) {
        applyTheme(event.matches ? "light" : "dark", { animate: true });
      }
    });
  }
});

// Navbar Clock - Real Time with AM/PM and GMT+5:30
function updateNavbarClock() {
  const now = new Date();

  // Get time in GMT+5:30 (India Standard Time)
  const offset = 5.5 * 60; // offset in minutes
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const indiaTime = new Date(utc + offset * 60000);

  let hours = indiaTime.getHours();
  const minutes = String(indiaTime.getMinutes()).padStart(2, "0");
  const seconds = String(indiaTime.getSeconds()).padStart(2, "0");

  // Convert to 12-hour format with AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12
  const hoursStr = String(hours).padStart(2, "0");

  const timeString = `${hoursStr}:${minutes}:${seconds} ${ampm}`;

  const navClockElement = document.getElementById("navClockTime");
  if (navClockElement) {
    navClockElement.textContent = timeString;
  }
}

// Update navbar clock immediately and then every second
updateNavbarClock();
setInterval(updateNavbarClock, 1000);

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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // ✅ now works
const db = getDatabase(app);

const countRef = ref(db, "clickCount");
const countSpan = document.getElementById("count");
const btn = document.getElementById("clickBtn");

onValue(countRef, (snapshot) => {
  const val = snapshot.val();
  countSpan.textContent = val ?? 0;
});

btn.addEventListener("click", () => {
  runTransaction(countRef, (current) => (current || 0) + 1);
});

// Hero Role Animation - subtle blur + pop
const roleTextElement = document.getElementById("roleText");
const roles = ["DSA Enthusiast", "Web Developer", "AI Explorer"];
const ROLE_EXIT_DURATION = 350;
const ROLE_CYCLE_DURATION = 4200;
let roleIndex = 0;
let roleAnimationLocked = false;

function cycleRoleText() {
  if (!roleTextElement || roleAnimationLocked) {
    return;
  }

  roleAnimationLocked = true;
  roleTextElement.classList.remove("role-enter");
  roleTextElement.classList.add("role-exit");

  setTimeout(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    roleTextElement.textContent = roles[roleIndex];
    roleTextElement.classList.remove("role-exit");
    // Force reflow to restart the blur-in animation
    void roleTextElement.offsetWidth;
    roleTextElement.classList.add("role-enter");
    roleAnimationLocked = false;
  }, ROLE_EXIT_DURATION);
}

document.addEventListener("DOMContentLoaded", () => {
  if (!roleTextElement) {
    return;
  }

  roleTextElement.textContent = roles[roleIndex];
  roleTextElement.classList.add("role-enter");
  setInterval(cycleRoleText, ROLE_CYCLE_DURATION);
});

// BTC Price Fetcher
async function fetchBTCPrice() {
  const btcValueElement = document.querySelector(".btc-value");

  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch BTC price");
    }

    const data = await response.json();
    const price = data.bitcoin.usd;

    // Format price with commas
    const formattedPrice = price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    btcValueElement.textContent = formattedPrice;
  } catch (error) {
    console.error("BTC price fetch error:", error);
    btcValueElement.textContent = "Unavailable";
  }
}

// Fetch BTC price on load
fetchBTCPrice();

// Update every 60 seconds
setInterval(fetchBTCPrice, 60000);

// Custom Audio Player - Ultra Minimal
document.addEventListener("DOMContentLoaded", function () {
  const spotifyPill = document.getElementById("spotifyPill");
  const audioPlayer = document.getElementById("audioPlayer");
  const playIcon = document.getElementById("spotifyPlayIcon");

  let isPlaying = false;

  // Set initial volume
  if (audioPlayer) {
    audioPlayer.volume = 0.7;

    // When song ends
    audioPlayer.addEventListener("ended", function () {
      isPlaying = false;
      audioPlayer.currentTime = 0;
      if (playIcon) {
        playIcon.className = "fa-solid fa-play spotify-play-icon";
      }
    });
  }

  // Pill click toggles play/pause
  if (spotifyPill && audioPlayer) {
    spotifyPill.addEventListener("click", function () {
      if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        if (playIcon) {
          playIcon.className = "fa-solid fa-play spotify-play-icon";
        }
      } else {
        audioPlayer.play().catch((error) => {
          console.log("Playback prevented:", error);
        });
        isPlaying = true;
        if (playIcon) {
          playIcon.className = "fa-solid fa-pause spotify-play-icon";
        }
      }
    });
  }
});

// Skills Category Filter
document.addEventListener("DOMContentLoaded", function () {
  const categoryButtons = document.querySelectorAll(".category-btn");
  const skillCards = document.querySelectorAll(".skill-card");

  // Initially show only proficient skills on page load
  skillCards.forEach((card) => {
    const cardCategories = card.getAttribute("data-category").split(" ");
    if (!cardCategories.includes("proficient")) {
      card.classList.add("hidden");
    }
  });

  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.getAttribute("data-category");

      // Update active button
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Filter skills
      skillCards.forEach((card) => {
        const cardCategories = card.getAttribute("data-category").split(" ");

        if (cardCategories.includes(category)) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
});

// ==================== DINO GAME ====================

class DinoGame {
  constructor(jumpSound = null) {
    this.canvas = document.getElementById("dinoCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.isGameOver = false;
    this.isPlaying = false;
    this.score = 0;
    this.hiScore = parseInt(localStorage.getItem("dinoHiScore")) || 0;
    this.jumpSound = jumpSound;

    // Game constants
    this.GRAVITY = 0.6;
    this.JUMP_STRENGTH = -12;
    this.BASE_SPEED = 6;
    this.MAX_SPEED = 11.5;
    this.SPEED_STEP = 0.5;
    this.DIFFICULTY_INTERVAL = 50;
    this.SPAWN_INTERVAL_MIN = 70;
    this.SPAWN_INTERVAL_MAX = 120;
    this.ENABLE_BIRD_SCORE = 80;

    // Dino properties
    this.dino = {
      x: 50,
      y: 150,
      width: 40,
      height: 45,
      dy: 0,
      jumping: false,
    };

    // Obstacles
    this.obstacles = [];
    this.currentSpeed = this.BASE_SPEED;
    this.framesUntilNextSpawn = this.randomSpawnInterval();

    this.adjustCanvasWidth = this.adjustCanvasWidth.bind(this);
    this.setupEventListeners();
    this.updateScoreDisplay();
    this.adjustCanvasWidth();
    window.addEventListener("resize", this.adjustCanvasWidth);
  }

  setupEventListeners() {
    // Keyboard controls
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        this.jump();
      }
    });

    // Click/Tap to jump
    this.canvas.addEventListener("click", () => {
      this.jump();
    });
  }

  jump() {
    if (this.isGameOver) {
      this.reset();
      return;
    }

    if (!this.isPlaying) {
      return;
    }

    if (!this.dino.jumping) {
      this.dino.dy = this.JUMP_STRENGTH;
      this.dino.jumping = true;

      // Play jump sound
      if (this.jumpSound) {
        this.jumpSound.currentTime = 0;
        this.jumpSound
          .play()
          .catch((err) => console.log("Audio play failed:", err));
      }
    }
  }

  start() {
    if (this.isPlaying) {
      return;
    }
    this.isPlaying = true;
    this.isGameOver = false;
    this.gameLoop();
  }

  reset() {
    this.obstacles = [];
    this.score = 0;
    this.isGameOver = false;
    this.dino.y = 150;
    this.dino.dy = 0;
    this.dino.jumping = false;
    this.currentSpeed = this.BASE_SPEED;
    this.framesUntilNextSpawn = this.randomSpawnInterval();
    this.start();
  }

  spawnObstacle() {
    const allowBirds = this.getDisplayScore() >= this.ENABLE_BIRD_SCORE;
    const types = allowBirds ? ["cactus", "bird"] : ["cactus"];
    const type = types[Math.floor(Math.random() * types.length)];

    const obstacle = {
      x: this.canvas.width,
      y: type === "cactus" ? 155 : 130,
      width: 20,
      height: type === "cactus" ? 40 : 30,
      type: type,
      speedOffset: type === "bird" ? 0.8 : 0,
    };

    this.obstacles.push(obstacle);
  }

  randomSpawnInterval() {
    const scoreFactor = this.getDisplayScore();
    const difficultyMultiplier = Math.min(1.8, 1 + scoreFactor / 120);
    const minInterval = Math.max(
      45,
      Math.floor(this.SPAWN_INTERVAL_MIN / difficultyMultiplier)
    );
    const maxInterval = Math.max(
      minInterval + 15,
      Math.floor(this.SPAWN_INTERVAL_MAX / difficultyMultiplier)
    );
    return (
      Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval
    );
  }

  getDisplayScore() {
    return Math.floor(this.score / 10);
  }

  updateDifficulty() {
    const level = Math.floor(this.getDisplayScore() / this.DIFFICULTY_INTERVAL);
    this.currentSpeed = Math.min(
      this.BASE_SPEED + level * this.SPEED_STEP,
      this.MAX_SPEED
    );
  }

  adjustCanvasWidth() {
    if (!this.canvas) {
      return;
    }
    const containerWidth = this.canvas.parentElement
      ? this.canvas.parentElement.clientWidth
      : 600;
    const horizontalPadding = 32;
    const rawTargetWidth = containerWidth - horizontalPadding;
    const targetWidth = Math.max(360, Math.min(600, rawTargetWidth));
    if (this.canvas.width !== targetWidth) {
      this.canvas.width = targetWidth;
    }
  }

  updatePhysics() {
    // Gravity
    this.dino.dy += this.GRAVITY;
    this.dino.y += this.dino.dy;

    // Ground collision
    if (this.dino.y >= 150) {
      this.dino.y = 150;
      this.dino.dy = 0;
      this.dino.jumping = false;
    }

    // Move obstacles
    this.obstacles.forEach((obstacle) => {
      obstacle.x -= this.currentSpeed + (obstacle.speedOffset || 0);
    });

    // Remove off-screen obstacles
    this.obstacles = this.obstacles.filter(
      (obstacle) => obstacle.x + obstacle.width > 0
    );

    // Spawn new obstacles with adaptive gaps
    this.framesUntilNextSpawn -= 1;
    if (this.framesUntilNextSpawn <= 0) {
      this.spawnObstacle();
      this.framesUntilNextSpawn = this.randomSpawnInterval();
    }

    // Score
    this.score++;
    if (this.score > this.hiScore) {
      this.hiScore = this.score;
      localStorage.setItem("dinoHiScore", this.hiScore);
    }
    this.updateDifficulty();
    this.updateScoreDisplay();
  }

  checkCollisions() {
    for (let obstacle of this.obstacles) {
      if (
        this.dino.x < obstacle.x + obstacle.width - 10 &&
        this.dino.x + this.dino.width - 10 > obstacle.x &&
        this.dino.y < obstacle.y + obstacle.height - 10 &&
        this.dino.y + this.dino.height - 10 > obstacle.y
      ) {
        this.isGameOver = true;
        this.isPlaying = false;
      }
    }
  }

  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw ground
    this.ctx.strokeStyle = getComputedStyle(document.body)
      .getPropertyValue("--text-color")
      .trim();
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 195);
    this.ctx.lineTo(this.canvas.width, 195);
    this.ctx.stroke();

    // Draw dino
    this.ctx.fillStyle = getComputedStyle(document.body)
      .getPropertyValue("--text-color")
      .trim();
    this.ctx.fillRect(
      this.dino.x,
      this.dino.y,
      this.dino.width,
      this.dino.height
    );

    // Draw eye
    this.ctx.fillStyle = getComputedStyle(document.body)
      .getPropertyValue("--bg-color")
      .trim();
    this.ctx.fillRect(this.dino.x + 28, this.dino.y + 8, 6, 6);

    // Draw obstacles
    this.obstacles.forEach((obstacle) => {
      this.ctx.fillStyle = getComputedStyle(document.body)
        .getPropertyValue("--text-color")
        .trim();
      if (obstacle.type === "cactus") {
        this.ctx.fillRect(
          obstacle.x,
          obstacle.y,
          obstacle.width,
          obstacle.height
        );
      } else {
        // Bird (flying)
        this.ctx.fillRect(
          obstacle.x,
          obstacle.y,
          obstacle.width,
          obstacle.height
        );
      }
    });

    // Game over text
    if (this.isGameOver) {
      this.ctx.fillStyle = getComputedStyle(document.body)
        .getPropertyValue("--text-color")
        .trim();
      this.ctx.font = "20px Courier New";
      this.ctx.textAlign = "center";
      this.ctx.fillText("GAME OVER", this.canvas.width / 2, 80);
      this.ctx.font = "14px Courier New";
      this.ctx.fillText(
        "Click or Press SPACE to restart",
        this.canvas.width / 2,
        105
      );
    }

    // Start message
    if (!this.isPlaying && !this.isGameOver) {
      this.ctx.fillStyle = getComputedStyle(document.body)
        .getPropertyValue("--text-color")
        .trim();
      this.ctx.font = "16px Courier New";
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        "Click or Press SPACE to start",
        this.canvas.width / 2,
        90
      );
    }
  }

  updateScoreDisplay() {
    const currentScoreEl = document.getElementById("currentScore");
    const hiScoreEl = document.getElementById("hiScore");
    const currentDisplayScore = this.getDisplayScore();

    if (currentScoreEl) {
      currentScoreEl.textContent = String(currentDisplayScore).padStart(5, "0");
    }
    if (hiScoreEl) {
      hiScoreEl.textContent = String(Math.floor(this.hiScore / 10)).padStart(
        5,
        "0"
      );
    }
  }

  gameLoop() {
    if (!this.isPlaying) return;

    this.updatePhysics();
    this.checkCollisions();
    this.draw();

    if (!this.isGameOver) {
      requestAnimationFrame(() => this.gameLoop());
    } else {
      this.draw();
    }
  }
}

// Toggle between terminal and dino game
document.addEventListener("DOMContentLoaded", () => {
  const profileImageTrigger = document.getElementById("profileImageTrigger");
  const terminalCard = document.getElementById("terminalCard");
  const dinoGameContainer = document.getElementById("dinoGameContainer");
  const closeDinoGame = document.getElementById("closeDinoGame");

  let dinoGame = null;

  if (profileImageTrigger && terminalCard && dinoGameContainer) {
    profileImageTrigger.addEventListener("click", () => {
      // Fade out terminal card
      terminalCard.classList.add("fade-out");

      setTimeout(() => {
        terminalCard.style.display = "none";
        terminalCard.classList.remove("fade-out");
        dinoGameContainer.style.display = "flex";

        // Trigger fade in
        setTimeout(() => {
          dinoGameContainer.classList.add("fade-in");
        }, 10);

        // Initialize or reset game and auto-start
        if (!dinoGame) {
          dinoGame = new DinoGame(gameSound);
          dinoGame.start();
        } else {
          dinoGame.reset();
        }
      }, 400);
    });

    const closeGame = () => {
      // Fade out game
      dinoGameContainer.classList.remove("fade-in");

      setTimeout(() => {
        dinoGameContainer.style.display = "none";
        terminalCard.style.display = "block";

        // Trigger fade in for terminal
        setTimeout(() => {
          terminalCard.style.opacity = "0.95";
        }, 10);

        // Stop game
        if (dinoGame) {
          dinoGame.isPlaying = false;
          dinoGame.isGameOver = true;
        }
      }, 400);
    };

    closeDinoGame.addEventListener("click", closeGame);

    // ESC key to close game
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && dinoGameContainer.style.display === "flex") {
        closeGame();
      }
    });
  }
});
