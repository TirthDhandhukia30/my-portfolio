/**
 * Vanilla JS implementation of Tooltip
 * Creates hoverable tooltips with custom content
 */

class Tooltip {
  constructor() {
    this.tooltips = new Map();
    this.activeTooltip = null;
    this.init();
  }

  init() {
    // Create tooltip container
    this.container = document.createElement("div");
    this.container.className = "tooltip-container";
    this.container.style.cssText = `
      position: fixed;
      z-index: 9999;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
    `;
    document.body.appendChild(this.container);

    // Listen for mouseover on elements with data-tooltip
    document.addEventListener("mouseover", (e) => {
      const target = e.target.closest("[data-tooltip]");
      if (target) {
        this.show(target);
      }
    });

    document.addEventListener("mouseout", (e) => {
      const target = e.target.closest("[data-tooltip]");
      if (target) {
        this.hide();
      }
    });

    // Update position on mouse move
    document.addEventListener("mousemove", (e) => {
      if (this.activeTooltip) {
        this.updatePosition(e.clientX, e.clientY);
      }
    });
  }

  show(element) {
    const content = element.getAttribute("data-tooltip");
    const type = element.getAttribute("data-tooltip-type") || "text";

    if (!content) return;

    this.activeTooltip = element;

    // Clear previous content
    this.container.innerHTML = "";

    // Create tooltip content based on type
    if (type === "card") {
      this.container.innerHTML = content;
    } else {
      this.container.textContent = content;
    }

    // Apply styles
    const theme = document.body.classList.contains("light-theme")
      ? "light"
      : "dark";
    this.container.className = `tooltip-container tooltip-${theme}`;

    // Show tooltip
    this.container.style.opacity = "1";
  }

  hide() {
    this.activeTooltip = null;
    this.container.style.opacity = "0";
  }

  updatePosition(mouseX, mouseY) {
    const offset = 15;
    const tooltipRect = this.container.getBoundingClientRect();

    let x = mouseX + offset;
    let y = mouseY + offset;

    // Prevent tooltip from going off-screen
    if (x + tooltipRect.width > window.innerWidth) {
      x = mouseX - tooltipRect.width - offset;
    }

    if (y + tooltipRect.height > window.innerHeight) {
      y = mouseY - tooltipRect.height - offset;
    }

    this.container.style.left = `${x}px`;
    this.container.style.top = `${y}px`;
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

// Auto-initialize on DOM load
if (typeof module !== "undefined" && module.exports) {
  module.exports = Tooltip;
}
