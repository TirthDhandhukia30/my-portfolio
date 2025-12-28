import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue
} from "framer-motion";
import { useState, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";

export function Dock() {
  const { theme, toggleTheme } = useTheme();
  const { scrollY } = useScroll();
  const [isHidden, setIsHidden] = useState(false);
  const mouseX = useMotionValue(Infinity);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[50] hidden md:flex items-end gap-4 pb-3">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "150%", opacity: 0 },
        }}
        initial="visible"
        animate={isHidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="mx-auto flex h-16 items-end gap-4 rounded-2xl bg-[var(--card-bg)]/80 border border-[var(--border-color)] px-4 pb-3 backdrop-blur-md shadow-2xl"
      >
        <DockIcon mouseX={mouseX} onClick={() => scrollToSection('hero')} label="Home">
          <i className="fa-solid fa-house" />
        </DockIcon>
        <DockIcon mouseX={mouseX} onClick={() => scrollToSection('projects')} label="Projects">
          <i className="fa-solid fa-code" />
        </DockIcon>
        <DockIcon mouseX={mouseX} onClick={() => scrollToSection('skills')} label="Stack">
          <i className="fa-solid fa-layer-group" />
        </DockIcon>
        <DockIcon mouseX={mouseX} onClick={() => scrollToSection('contact')} label="Contact">
          <i className="fa-solid fa-envelope" />
        </DockIcon>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-[var(--border-color)] self-center mx-1" />

        <DockIcon mouseX={mouseX} onClick={() => window.open('https://github.com/TirthDhandhukia30', '_blank')} label="GitHub">
          <i className="fa-brands fa-github" />
        </DockIcon>
        <DockIcon mouseX={mouseX} onClick={() => window.open('https://www.linkedin.com/in/tirthdhandhukia/', '_blank')} label="LinkedIn">
          <i className="fa-brands fa-linkedin" />
        </DockIcon>
        <DockIcon mouseX={mouseX} onClick={() => window.open('https://twitter.com', '_blank')} label="Twitter">
          <i className="fa-brands fa-x-twitter" />
        </DockIcon>
        <DockIcon mouseX={mouseX} onClick={toggleTheme} label="Theme">
          <i className={theme === 'dark' ? "fa-regular fa-sun" : "fa-regular fa-moon"} />
        </DockIcon>
      </motion.div>
    </div>
  );
}

function DockIcon({
  mouseX,
  children,
  onClick,
  label
}: {
  mouseX: MotionValue;
  children: React.ReactNode;
  onClick?: () => void;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [44, 64, 44]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const fontSize = useTransform(width, (w) => w * 0.4);

  return (
    <div className="relative group">
      <motion.div
        ref={ref}
        style={{ width }}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="aspect-square cursor-pointer rounded-full bg-[var(--hover-bg-color)] flex items-center justify-center text-[var(--text-color)] border border-[var(--border-color)] hover:border-[var(--text-color)] transition-colors duration-200"
      >
        <motion.div
          className="flex items-center justify-center"
          style={{ fontSize }}
        >
          {children}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--text-color)] text-[var(--bg-color)] text-[10px] font-medium whitespace-nowrap z-50 pointer-events-none shadow-lg"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
