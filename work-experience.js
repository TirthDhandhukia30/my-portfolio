// Work Experience Data and Rendering

const experiences = [
  {
    id: "whop",
    companyName: "Whop",
    companyLogo: "",
    isCurrentEmployer: true,
    positions: [
      {
        id: "whop-freelancer",
        title: "Freelancer",
        employmentPeriod: "09.2024 — present",
        employmentType: "Freelance",
        icon: "code",
        description: [
          "Created landing pages for clients and worked on UI/UX.",
          "Developed responsive web applications using React and Tailwind CSS.",
          "Implemented custom styling solutions with vanilla CSS.",
        ],
        skills: ["React", "Tailwind CSS", "CSS", "UI/UX"],
        isExpanded: true,
      },
    ],
  },
  {
    id: "caesex",
    companyName: "CAESEX",
    companyLogo: "",
    isCurrentEmployer: false,
    positions: [
      {
        id: "caesex-intern",
        title: "Data & Research Intern",
        employmentPeriod: "06.2025 — 07.2025",
        employmentType: "Internship",
        icon: "code",
        description: [
          "Trained and tested different ML models to identify high-risk fire zones using historical incident data.",
          "Reduced equipment installation time by 25% through targeted deployment strategies.",
          "Enhanced safety coverage and accessibility by 90% in high-risk areas via data-driven allocation.",
        ],
        skills: ["Machine Learning", "Data Analysis", "Python"],
        isExpanded: false,
      },
    ],
  },
  {
    id: "confidential",
    companyName: "Confidential",
    companyLogo: "",
    isCurrentEmployer: false,
    positions: [
      {
        id: "frontend-intern",
        title: "Frontend Intern",
        employmentPeriod: "05.2024 — 07.2024",
        employmentType: "Internship",
        icon: "code",
        description: [
          "Collaborated on building an Admin Panel and dashboard using React and ShadCN UI, enabling faster navigation and reducing manual reporting time by 25%.",
          "Contributed to developing employee profile management features, improving HR data accessibility and cutting profile update time by 30%.",
        ],
        skills: ["React", "ShadCN UI", "JavaScript"],
        isExpanded: false,
      },
    ],
  },
];

// Icon mapping
const iconEmojiMap = {
  code: "🧑‍💻",
  design: "🎨",
  business: "🏢",
  education: "🎓",
};

function createExperienceItem(experience) {
  const wrapper = document.createElement("div");
  wrapper.className = "experience-item";

  wrapper.innerHTML = `
    <div class="company-header">
      <div class="company-name${
        experience.id === "confidential" ? " company-blur" : ""
      }">${experience.companyName}</div>
      ${
        experience.isCurrentEmployer
          ? `<span class="current-employer-indicator" title="Current employer"></span>`
          : ""
      }
    </div>
    <div class="positions-wrapper"></div>
  `;

  const positionsWrapper = wrapper.querySelector(".positions-wrapper");

  experience.positions.forEach((position) => {
    const positionEl = document.createElement("div");
    positionEl.className = "position";
    positionEl.dataset.open = position.isExpanded ? "true" : "false";

    const icon =
      position.icon === "code"
        ? "fa-solid fa-code"
        : position.icon === "design"
        ? "fa-solid fa-palette"
        : position.icon === "business"
        ? "fa-solid fa-briefcase"
        : "fa-solid fa-graduation-cap";

    positionEl.innerHTML = `
      <button class="position-toggle" type="button" aria-expanded="${
        position.isExpanded ? "true" : "false"
      }">
        <div class="position-header">
          <i class="position-icon ${icon}" aria-hidden="true"></i>
          <div class="position-title">${position.title}</div>
          <i class="position-chevron fa-solid fa-chevron-down" aria-hidden="true"></i>
        </div>
        <div class="position-meta">
          ${
            position.employmentType
              ? `<span>${position.employmentType}</span>
                 <span class="meta-separator"></span>`
              : ""
          }
          <span>${position.employmentPeriod}</span>
        </div>
      </button>
      <div class="position-body">
        ${
          position.description && position.description.length
            ? `<ul class="position-description">
                ${position.description
                  .map((line) => `<li>${line}</li>`)
                  .join("")}
              </ul>`
            : ""
        }
      </div>
    `;

    positionsWrapper.appendChild(positionEl);
  });

  return wrapper;
}

function renderWorkExperience(rootId, data) {
  const root = document.getElementById(rootId);
  if (!root) return;

  data.forEach((exp) => {
    const el = createExperienceItem(exp);
    root.appendChild(el);
  });

  // Wire up collapsible toggles
  root.querySelectorAll(".position").forEach((positionEl) => {
    const toggle = positionEl.querySelector(".position-toggle");
    const body = positionEl.querySelector(".position-body");

    if (!toggle || !body) return;

    // Allow initial open animation to settle
    if (positionEl.dataset.open === "true") {
      body.style.maxHeight = body.scrollHeight + "px";
    }

    toggle.addEventListener("click", () => {
      const isOpen = positionEl.dataset.open === "true";
      const nextState = !isOpen;

      positionEl.dataset.open = nextState ? "true" : "false";
      toggle.setAttribute("aria-expanded", nextState ? "true" : "false");

      if (nextState) {
        body.style.maxHeight = body.scrollHeight + "px";
      } else {
        body.style.maxHeight = "0px";
      }
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    renderWorkExperience("work-experience-container", experiences);
  });
} else {
  renderWorkExperience("work-experience-container", experiences);
}
