import { SparklesSection } from '../components/SparklesSection';

interface Skill {
  name: string;
  icon: string;
  link: string;
}

const SKILLS: Skill[] = [
  { name: 'JavaScript', icon: '/images/JavaScript.svg', link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { name: 'TypeScript', icon: '/images/TypeScript.svg', link: 'https://www.typescriptlang.org/' },
  { name: 'Python', icon: '/images/Python.png', link: 'https://www.python.org/' },
  { name: 'React', icon: '/images/React.svg', link: 'https://react.dev/' },
  { name: 'Node.js', icon: '/images/NodeJS.svg', link: 'https://nodejs.org/' },
  { name: 'Tailwind CSS', icon: '/images/TailwindCSS.svg', link: 'https://tailwindcss.com/' },
  { name: 'Bootstrap', icon: '/images/Bootstrap.svg', link: 'https://getbootstrap.com/' },
  { name: 'Firebase', icon: '/images/Firebase.png', link: 'https://firebase.google.com/' },
  { name: 'Supabase', icon: '/images/Supabase.svg', link: 'https://supabase.com/' },
  { name: 'MongoDB', icon: '/images/MongoDB.svg', link: 'https://www.mongodb.com/' },
  { name: 'PostgreSQL', icon: '/images/PostgresSQL.png', link: 'https://www.postgresql.org/' },
  { name: 'AWS', icon: '/images/AWS.png', link: 'https://aws.amazon.com/' },
  { name: 'Git', icon: '/images/Git.svg', link: 'https://git-scm.com/' },
  { name: 'Docker', icon: '/images/Docker.svg', link: 'https://www.docker.com/' },
  { name: 'Postman', icon: '/images/Postman.png', link: 'https://www.postman.com/' },
  { name: 'Bun', icon: '/images/Bun.svg', link: 'https://bun.sh/' },
];

export function StackSection() {
  return (
    <SparklesSection
      id="skills"
      className="scroll-section relative bg-[var(--bg-color)] text-[var(--text-color)] py-14 px-6 transition-colors duration-300
        before:content-[''] before:absolute before:left-1/2 before:top-0 before:-translate-x-1/2 before:w-screen before:border-t before:border-dashed before:border-[var(--edge)] before:h-0 before:pointer-events-none before:z-0 before:transition-colors before:duration-300
        max-md:py-[80px] max-md:px-8
        max-sm:py-[50px] max-sm:px-5
        max-[480px]:py-14 max-[480px]:px-4
        max-[360px]:py-[40px] max-[360px]:px-3"
    >
      <div className="max-w-[700px] mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-[var(--text-color)] tracking-[-0.025em]">
          Stack
        </h2>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(48px,1fr))] gap-3 mb-6
          max-sm:grid-cols-[repeat(auto-fill,minmax(36px,1fr))] max-sm:gap-2
          max-[480px]:grid-cols-[repeat(auto-fill,minmax(32px,1fr))] max-[480px]:gap-1.5"
        >
          {SKILLS.map((skill) => (
            <a
              key={skill.name}
              href={skill.link}
              target="_blank"
              rel="noopener noreferrer"
              data-tooltip={skill.name}
              className="flex items-center justify-center opacity-100 transition-opacity duration-200 aspect-square no-underline hover:opacity-70"
            >
              <img
                src={skill.icon}
                alt={skill.name}
                loading="lazy"
                className="w-12 h-12 object-contain max-sm:w-9 max-sm:h-9 max-[480px]:w-8 max-[480px]:h-8"
              />
            </a>
          ))}
        </div>
      </div>
    </SparklesSection>
  );
}
