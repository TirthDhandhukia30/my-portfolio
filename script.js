import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import {
  getDatabase,
  ref,
  onValue,
  runTransaction,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Theme Toggle
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;
  if (!themeToggle) {
    return;
  }

  let themeTransitionTimeout;

  const startThemeTransition = () => {
    body.classList.add("theme-transition");
    clearTimeout(themeTransitionTimeout);
    themeTransitionTimeout = setTimeout(() => {
      body.classList.remove("theme-transition");
    }, 850);
  };

  // Check for saved theme in localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light-theme") {
    body.classList.add("light-theme");
    themeToggle.checked = true;
  }

  // Toggle theme on checkbox change
  themeToggle.addEventListener("change", () => {
    startThemeTransition();
    if (themeToggle.checked) {
      body.classList.add("light-theme");
      localStorage.setItem("theme", "light-theme");
    } else {
      body.classList.remove("light-theme");
      localStorage.removeItem("theme");
    }
  });
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

// Typewriter Animation
const typewriterElement = document.getElementById("typewriter");
const roles = ["DSA Enthusiast", "Web Developer", "AI Explorer"];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100; // milliseconds per character

function typeWriter() {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    // Remove characters
    typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 50; // Faster deletion
  } else {
    // Add characters
    typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    typingSpeed = 100; // Normal typing speed
  }

  // Check if word is complete
  if (!isDeleting && charIndex === currentRole.length) {
    // Pause at end of word
    typingSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Move to next role
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    typingSpeed = 500; // Pause before starting new word
  }

  setTimeout(typeWriter, typingSpeed);
}

// Start the typewriter animation when page loads
document.addEventListener("DOMContentLoaded", typeWriter);

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
  const spotifyPopup = document.getElementById("spotifyPopup");
  const closeSpotify = document.getElementById("closeSpotify");
  const audioPlayer = document.getElementById("audioPlayer");
  const playPauseBtn = document.getElementById("playPauseBtn");

  let isPlaying = false;

  // Set initial volume
  if (audioPlayer) {
    audioPlayer.volume = 0.7;

    // When song ends
    audioPlayer.addEventListener("ended", function () {
      isPlaying = false;
      playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      audioPlayer.currentTime = 0;
    });
  }

  // Play/Pause button
  if (playPauseBtn && audioPlayer) {
    playPauseBtn.addEventListener("click", function () {
      if (isPlaying) {
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      } else {
        audioPlayer.play();
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      }
      isPlaying = !isPlaying;
    });
  }

  // Popup controls with auto-play
  if (spotifyPill && spotifyPopup && closeSpotify) {
    // Open popup and auto-play when pill is clicked
    spotifyPill.addEventListener("click", function () {
      spotifyPopup.classList.add("active");
      document.body.style.overflow = "hidden";

      // Auto-play the song
      if (audioPlayer) {
        audioPlayer
          .play()
          .then(() => {
            isPlaying = true;
            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
          })
          .catch((error) => {
            console.log("Auto-play prevented:", error);
          });
      }
    });

    // Close popup and pause audio
    function closePopup() {
      spotifyPopup.classList.remove("active");
      document.body.style.overflow = "";
      if (audioPlayer && isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      }
    }

    closeSpotify.addEventListener("click", closePopup);

    // Close popup when clicking outside
    spotifyPopup.addEventListener("click", function (e) {
      if (e.target === spotifyPopup) {
        closePopup();
      }
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", function (e) {
      // Close popup with Escape key
      if (e.key === "Escape" && spotifyPopup.classList.contains("active")) {
        closePopup();
      }

      // Play/Pause with Spacebar (only when popup is open)
      if (e.code === "Space" && spotifyPopup.classList.contains("active")) {
        e.preventDefault(); // Prevent page scroll
        if (audioPlayer && playPauseBtn) {
          if (isPlaying) {
            audioPlayer.pause();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
          } else {
            audioPlayer.play();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
          }
          isPlaying = !isPlaying;
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
