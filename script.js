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
