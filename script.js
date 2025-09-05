import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import {
  getDatabase,
  ref,
  onValue,
  runTransaction,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
// Simple dark/light theme toggle
const themeToggle = document.getElementById("themeToggle");

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  const isDark = theme === "dark";
  if (themeToggle) {
    themeToggle.querySelector("i").className = isDark ? "fa-solid fa-sun theme-icon" : "fa-solid fa-moon theme-icon";
  }
};

const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    applyTheme(current === "dark" ? "light" : "dark");
  });
}

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
