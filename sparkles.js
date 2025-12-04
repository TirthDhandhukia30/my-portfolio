/**
 * Vanilla JS implementation of Sparkles
 * Creates animated sparkle particles
 */

class Sparkles {
  constructor(container, options = {}) {
    this.container = container;

    // Default options
    this.options = {
      background: options.background ?? "transparent",
      minSize: options.minSize ?? 0.4,
      maxSize: options.maxSize ?? 1,
      particleDensity: options.particleDensity ?? 1200,
      particleColor: options.particleColor ?? "#FFFFFF",
      className: options.className ?? "",
      opacity: options.opacity ?? 0.6,
    };

    this.particles = [];
    this.animationFrameId = null;
    this.init();
  }

  init() {
    // Create canvas element
    this.canvas = document.createElement("canvas");
    this.canvas.className = `sparkles-canvas ${this.options.className}`;
    this.canvas.style.position = "absolute";
    this.canvas.style.inset = "0";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = "0";
    this.canvas.style.opacity = this.options.opacity;

    if (this.options.background !== "transparent") {
      this.canvas.style.background = this.options.background;
    }

    this.ctx = this.canvas.getContext("2d");

    // Append to container
    this.container.style.position = "relative";
    this.container.appendChild(this.canvas);

    // Setup resize observer
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.container);

    // Initial setup
    this.handleResize();
    this.createParticles();
    this.animate();
  }

  handleResize() {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    // Recreate particles on resize
    if (this.particles.length > 0) {
      this.createParticles();
    }
  }

  createParticles() {
    this.particles = [];
    const area = this.canvas.width * this.canvas.height;
    const count = Math.floor(area / this.options.particleDensity);

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size:
          this.options.minSize +
          Math.random() * (this.options.maxSize - this.options.minSize),
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.5,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.03,
      });
    }
  }

  getCurrentTheme() {
    return document.body.classList.contains("light-theme") ? "light" : "dark";
  }

  animate() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const theme = this.getCurrentTheme();
    const baseColor = this.options.particleColor;

    // Update and draw particles
    this.particles.forEach((particle) => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      // Update twinkle effect
      particle.phase += particle.twinkleSpeed;
      const twinkle = (Math.sin(particle.phase) + 1) / 2;

      // Calculate opacity with twinkle
      const opacity = particle.opacity * twinkle;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      // Apply color based on theme
      let color;
      if (theme === "light") {
        color = this.hexToRgba("#2d2d2d", opacity);
      } else {
        color = this.hexToRgba(baseColor, opacity);
      }

      this.ctx.fillStyle = color;
      this.ctx.fill();

      // Add glow effect for brighter particles
      if (twinkle > 0.7) {
        const gradient = this.ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 3
        );

        if (theme === "light") {
          gradient.addColorStop(0, this.hexToRgba("#2d2d2d", opacity * 0.6));
          gradient.addColorStop(1, this.hexToRgba("#2d2d2d", 0));
        } else {
          gradient.addColorStop(0, this.hexToRgba(baseColor, opacity * 0.5));
          gradient.addColorStop(1, this.hexToRgba(baseColor, 0));
        }

        this.ctx.fillStyle = gradient;
        this.ctx.fill();
      }
    });

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  hexToRgba(hex, alpha) {
    // Handle CSS variables or direct hex values
    if (hex.startsWith("#")) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    // Fallback for non-hex colors
    return `rgba(255, 255, 255, ${alpha})`;
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = Sparkles;
}
