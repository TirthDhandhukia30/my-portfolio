import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import {
  getDatabase,
  ref,
  onValue,
  runTransaction,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
// Dark mode only - no theme toggle needed
// Remove any saved theme preference
localStorage.removeItem("theme");

// Terminal Clock - Real Time
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const timeString = `${hours}:${minutes}:${seconds}`;

  const clockElement = document.getElementById("terminalClock");
  if (clockElement) {
    clockElement.textContent = timeString;
  }
}

// Update clock immediately and then every second
updateClock();
setInterval(updateClock, 1000);

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

// GitHub Activity Integration
async function fetchGitHubActivity() {
  const githubContent = document.getElementById("githubActivity");

  try {
    const response = await fetch(
      "https://api.github.com/users/TirthDhandhukia30/events/public"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch GitHub activity");
    }

    const events = await response.json();

    // Find the most recent push event
    const pushEvent = events.find((event) => event.type === "PushEvent");

    if (pushEvent) {
      const repoName = pushEvent.repo.name;
      const timeAgo = getTimeAgo(new Date(pushEvent.created_at));
      const commitMessage =
        pushEvent.payload.commits?.[0]?.message || "Recent commit";
      const repoUrl = `https://github.com/${repoName}`;

      displayGitHubActivity({
        action: `Pushed to ${repoName.split("/")[1]}`,
        time: timeAgo,
        url: repoUrl,
      });
    } else {
      // Try other event types
      const recentEvent = events[0];
      if (recentEvent) {
        const repoName = recentEvent.repo.name;
        const timeAgo = getTimeAgo(new Date(recentEvent.created_at));
        const action = getEventAction(recentEvent.type);
        const repoUrl = `https://github.com/${repoName}`;

        displayGitHubActivity({
          action: `${action} ${repoName.split("/")[1]}`,
          time: timeAgo,
          url: repoUrl,
        });
      } else {
        showGitHubPlaceholder();
      }
    }
  } catch (error) {
    console.error("GitHub API error:", error);
    showGitHubPlaceholder();
  }
}

function getEventAction(eventType) {
  const actions = {
    PushEvent: "Pushed to",
    CreateEvent: "Created",
    PullRequestEvent: "Pull request on",
    IssuesEvent: "Issue on",
    WatchEvent: "Starred",
    ForkEvent: "Forked",
  };
  return actions[eventType] || "Activity on";
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
    }
  }

  return "just now";
}

function displayGitHubActivity(activity) {
  const githubContent = document.getElementById("githubActivity");

  githubContent.innerHTML = `
    <a href="${activity.url}" target="_blank" rel="noopener noreferrer" class="github-activity">
      <i class="fa-brands fa-github github-icon"></i>
      <div class="github-info">
        <div class="github-action">${activity.action}</div>
        <div class="github-repo">${activity.time}</div>
      </div>
      <i class="fa-solid fa-arrow-up-right github-link-icon"></i>
    </a>
  `;
}

function showGitHubPlaceholder() {
  const githubContent = document.getElementById("githubActivity");

  githubContent.innerHTML = `
    <div class="github-activity" style="cursor: default;">
      <i class="fa-brands fa-github github-icon"></i>
      <div class="github-info">
        <div class="github-action">No recent activity</div>
        <div class="github-repo">Check back later</div>
      </div>
    </div>
  `;
}

// Load GitHub activity on page load
fetchGitHubActivity();

// Refresh every 5 minutes
setInterval(fetchGitHubActivity, 300000);

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

// Spotify via Firebase - Real-time Updates
const spotifyRef = ref(db, "spotify");

// Wait for DOM to be ready
function initSpotify() {
  const spotifyActivity = document.getElementById("spotifyActivity");
  const spotifySong = document.getElementById("spotifySong");
  const spotifyArtist = document.getElementById("spotifyArtist");

  if (!spotifyActivity || !spotifySong || !spotifyArtist) {
    console.error("Spotify elements not found!");
    return;
  }

  onValue(spotifyRef, (snapshot) => {
    const data = snapshot.val();
    console.log("Spotify data from Firebase:", data);

    if (data && data.isPlaying && data.song) {
      // Show what's playing
      spotifySong.textContent = data.song;
      spotifyArtist.textContent = data.artist;
      spotifyActivity.style.display = "inline-flex";
      console.log("✅ Showing Spotify pill:", data.song, "-", data.artist);
    } else {
      // Hide the pill when not playing
      spotifyActivity.style.display = "none";
      console.log("⏸️ Hiding Spotify pill");
    }
  });
}

// Initialize Spotify after DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSpotify);
} else {
  initSpotify();
}

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
