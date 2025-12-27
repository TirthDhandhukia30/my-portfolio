/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "var(--background)",
        },
        foreground: {
          DEFAULT: "var(--text-color)",
          muted: "var(--text-muted)",
        },
        border: {
          DEFAULT: "var(--border-color)",
        },
        card: {
          DEFAULT: "var(--card-bg)",
        },
        accent: {
          DEFAULT: "var(--accent-color)",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
      maxWidth: {
        container: "920px",
        terminal: "700px",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "ping-slow": "ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite",
        "border-sweep": "borderSweep 5s linear infinite",
        "role-blur-in": "roleBlurIn 0.55s ease forwards",
        "role-blur-out": "roleBlurOut 0.35s ease forwards",
        "shooting-star-1": "shootingStarHeroA 6s ease-in-out infinite",
        "shooting-star-2": "shootingStarHeroB 7.5s ease-in-out infinite 1.8s",
        "shooting-star-3": "shootingStarHeroC 8.5s ease-in-out infinite 3.2s",
        "shooting-star-4": "shootingStarHeroD 9.5s ease-in-out infinite 4.4s",
        "hint-fade": "hintFade 4s ease-in-out infinite",
        "arrow-pulse": "arrowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        borderSweep: {
          "0%": { backgroundPosition: "0% 0" },
          "100%": { backgroundPosition: "300% 0" },
        },
        roleBlurIn: {
          "0%": {
            opacity: "0",
            filter: "blur(10px)",
            transform: "translateY(10px) scale(0.98)",
          },
          "60%": {
            opacity: "1",
            filter: "blur(0)",
            transform: "translateY(0) scale(1)",
          },
          "100%": { opacity: "0.9" },
        },
        roleBlurOut: {
          "0%": {
            opacity: "0.9",
            filter: "blur(0)",
            transform: "translateY(0) scale(1)",
          },
          "100%": {
            opacity: "0",
            filter: "blur(10px)",
            transform: "translateY(-8px) scale(0.98)",
          },
        },
        shootingStarHeroA: {
          "0%": { transform: "translate(0, 0)", opacity: "0" },
          "8%": { opacity: "1" },
          "80%": { opacity: "0.7" },
          "100%": { transform: "translate(620px, 260px)", opacity: "0" },
        },
        shootingStarHeroB: {
          "0%": { transform: "translate(0, 0)", opacity: "0" },
          "8%": { opacity: "1" },
          "80%": { opacity: "0.7" },
          "100%": { transform: "translate(540px, -230px)", opacity: "0" },
        },
        shootingStarHeroC: {
          "0%": { transform: "translate(0, 0)", opacity: "0" },
          "8%": { opacity: "1" },
          "80%": { opacity: "0.7" },
          "100%": { transform: "translate(590px, 210px)", opacity: "0" },
        },
        shootingStarHeroD: {
          "0%": { transform: "translate(0, 0)", opacity: "0" },
          "8%": { opacity: "1" },
          "80%": { opacity: "0.7" },
          "100%": { transform: "translate(520px, -260px)", opacity: "0" },
        },
        hintFade: {
          "0%, 100%": { opacity: "0.45" },
          "40%": { opacity: "0.75" },
        },
        arrowPulse: {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.6" },
          "50%": { transform: "translateY(2px)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
