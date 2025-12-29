import { useEffect, useRef } from 'react';
import { SparklesSection } from '../components/SparklesSection';

// Map technology names to their icon paths
const TECH_ICONS: Record<string, string> = {
  'TypeScript': '/images/TypeScript.svg',
  'Tailwind CSS': '/images/TailwindCSS.svg',
  'React': '/images/React.svg',
  'JavaScript': '/images/JavaScript.svg',
  'Node.js': '/images/NodeJS.svg',
  'MongoDB': '/images/MongoDB.svg',
  'Firebase': '/images/Firebase.png',
  'Supabase': '/images/Supabase.svg',
  'PostgreSQL': '/images/PostgresSQL.png',
  'Docker': '/images/Docker.svg',
  'AWS': '/images/AWS.png',
  'Git': '/images/Git.svg',
  'Python': '/images/Python.png',
  'Bootstrap': '/images/Bootstrap.svg',
  'Postman': '/images/Postman.png',
  'Vercel': '/images/Vercel.svg',
  'Vite': '/images/Vite.svg',
  'Bun': '/images/Bun.svg',
  // Add more mappings as needed - icons without mappings will show text
};

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  tooltip: string;
  tags: string[];
  imageClass?: string;
}

const PROJECTS: Project[] = [
  {
    id: 'readdocs',
    title: 'readDocs',
    description: 'Exit the tutorial hell. A documentation warehouse for developers.',
    image: '/images/readDocs.png',
    link: 'https://readDocs.vercel.app',
    tooltip: 'Documentation Warehouse',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Bun'],
  },
  {
    id: 'invoicegen',
    title: 'InvoiceGen',
    description: 'A SaaS platform for generating and managing professional invoices.',
    image: '/images/invoicegen.png',
    link: 'https://invoicegen-tirth.vercel.app/',
    tooltip: 'Invoice Generator',
    tags: ['React', 'JavaScript', 'Vite', 'Tailwind CSS', 'Bun'],
    imageClass: 'invoicegen-image',
  },
  {
    id: 'metacheck',
    title: 'MetaCheck',
    description: 'A comprehensive metadata checker for your web applications.',
    image: '/images/metacheck.png',
    link: 'https://metacheck.vercel.app',
    tooltip: 'Meta Tag Validator',
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Bun'],
  },
];

function TechIcon({ name }: { name: string }) {
  const iconPath = TECH_ICONS[name];

  if (iconPath) {
    return (
      <img
        src={iconPath}
        alt={name}
        className="w-5 h-5 object-contain max-[480px]:w-4 max-[480px]:h-4"
      />
    );
  }

  // Fallback to text if no icon available
  return (
    <span
      className="px-2 py-[3px] bg-[rgba(128,128,128,0.1)] border border-[var(--border-color)] opacity-80 rounded-md text-[10px] text-[var(--text-color)] font-semibold font-sans transition-all duration-200 uppercase tracking-[0.3px] max-[480px]:text-[9px] max-[480px]:px-1.5 max-[480px]:py-0.5"
    >
      {name}
    </span>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className="w-full h-[400px] bg-[var(--card-bg)] border border-[var(--border-color)] opacity-90 rounded relative flex flex-col overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:opacity-100 hover:-translate-y-1
        max-md:h-auto max-md:min-h-[350px]
        max-[480px]:min-h-[380px]
        max-[480px]:h-auto"
    >
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline text-inherit flex flex-col h-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1"
      >
        {/* Card Image - same height on mobile as desktop */}
        <div className="w-full h-40 overflow-hidden relative bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb] flex items-center justify-center">
          <img
            src={project.image}
            alt={`${project.title} Preview`}
            className={`w-full h-full object-cover block ${project.imageClass || ''}`}
            loading="lazy"
          />
        </div>

        {/* Card Content */}
        <div className="p-5 flex flex-col flex-1 bg-[var(--card-bg)] transition-colors duration-300 max-md:p-4 max-[480px]:p-4">
          <h3 className="font-sans text-2xl leading-[1.3] text-[var(--text-color)] font-bold m-0 mb-3 flex items-center gap-2 max-[480px]:text-xl max-[480px]:mb-2.5">
            {project.title}
          </h3>
          <p className="text-sm leading-relaxed text-[var(--text-color)] opacity-70 m-0 mb-4 flex-1 max-[480px]:text-[13px]">
            {project.description}
          </p>
          <p className="text-[11px] text-[var(--text-color)] opacity-50 m-0 mb-2 mt-2 max-[480px]:mt-4 font-medium uppercase tracking-[0.5px]">
            Technologies
          </p>
          <div className="flex flex-wrap items-center gap-3 m-0 mb-4 max-[480px]:m-0 max-[480px]:mb-3 max-[480px]:gap-2">
            {project.tags.map((tag) => (
              <TechIcon key={tag} name={tag} />
            ))}
          </div>
        </div>
      </a>
    </article>
  );
}

export function ProjectsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Duplicate the projects array enough times to create a smooth infinite scroll feel
  const displayedProjects = [...PROJECTS, ...PROJECTS, ...PROJECTS, ...PROJECTS, ...PROJECTS, ...PROJECTS];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const autoScroll = () => {
      // Don't auto-scroll on mobile where we show a vertical stack
      if (window.innerWidth < 768) return;

      // Desktop logic only now
      const cardWidth = 350;
      const gap = 24;
      const scrollAmount = cardWidth + gap;

      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;

      // Reset if we've reached near the end
      if (scrollContainer.scrollLeft >= maxScroll - 50) {
        scrollContainer.scrollTo({ left: 0, behavior: 'instant' });
      } else {
        scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };

    const interval = setInterval(autoScroll, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <SparklesSection
      id="projects"
      className="scroll-section py-20 px-6 bg-[var(--bg-color)] relative transition-colors duration-300
        before:content-[''] before:absolute before:left-1/2 before:top-0 before:-translate-x-1/2 before:w-screen before:border-t before:border-dashed before:border-[var(--edge)] before:h-0 before:pointer-events-none before:z-0 before:transition-colors before:duration-300
        max-md:py-[80px] max-md:px-8
        max-sm:py-[50px] max-sm:px-5
        max-[480px]:py-16 max-[480px]:px-4
        max-[360px]:py-[40px] max-[360px]:px-3"
    >
      {/* Title - same structure as other sections */}
      <div className="max-w-[700px] mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-[var(--text-color)] tracking-[-0.025em]">
          Projects
        </h2>
      </div>

      {/* Carousel container - breaks out of padding with negative margins */}
      <div className="relative -mx-6 max-md:-mx-8 max-sm:-mx-5 max-[480px]:-mx-4 max-[360px]:-mx-3">
        {/* Left gradient overlay - desktop only */}
        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-[120px] bg-gradient-to-r from-[var(--bg-color)] to-transparent z-10 pointer-events-none" />

        {/* Right gradient overlay - desktop only */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[120px] bg-gradient-to-l from-[var(--bg-color)] to-transparent z-10 pointer-events-none" />

        {/* Visible area wrapper - shows exactly 2 cards (724px = 350*2 + 24 gap) */}
        <div className="w-full md:max-w-[724px] md:mx-auto overflow-hidden">
          {/* Carousel scroll container */}
          <div
            className="w-full overflow-x-auto pb-8 pt-4 no-scrollbar [&::-webkit-scrollbar]:hidden"
            ref={scrollRef}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Mobile: Vertical Grid, Desktop: Horizontal Flex */}
            <div className="flex flex-col md:flex-row gap-6 px-6 md:px-0 max-[480px]:px-4 md:w-max">
              {displayedProjects.map((project, index) => (
                <div
                  key={`${project.id}-${index}`}
                  className={`w-full md:w-[350px] flex-shrink-0 snap-center ${index >= 3 ? 'hidden md:block' : ''}`}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[700px] mx-auto px-6 max-[480px]:px-4">
        {/* Footer Text */}
        <div className="flex items-center justify-center mt-6">
          <p className="text-[0.9375rem] text-[var(--text-color)] opacity-45 m-0 text-center leading-relaxed italic max-[480px]:text-[0.875rem]">
            Make sure to star the projects you like. Check out my other cool work on my{' '}
            <a
              href="https://github.com/TirthDhandhukia30"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-color)] opacity-100 underline underline-offset-2 font-semibold transition-all duration-200 hover:opacity-80"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </SparklesSection>
  );
}

