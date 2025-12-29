import { Suspense, lazy } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from './contexts/ThemeContext';
import { TooltipProvider } from './components/Tooltip';
import { IntroOverlay } from './components/IntroOverlay';
import { CommandPalette } from './components/CommandPalette';
import { Dock } from './components/Dock';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './sections/HeroSection';

// Lazy load sections that aren't immediately visible
const CliSection = lazy(() => import('./sections/CliSection').then(m => ({ default: m.CliSection })));
const ActivitySection = lazy(() => import('./sections/ActivitySection').then(m => ({ default: m.ActivitySection })));
const GitHubContributionsSection = lazy(() => import('./sections/GitHubContributionsSection').then(m => ({ default: m.GitHubContributionsSection })));
const ProjectsSection = lazy(() => import('./sections/ProjectsSection').then(m => ({ default: m.ProjectsSection })));
const StackSection = lazy(() => import('./sections/StackSection').then(m => ({ default: m.StackSection })));
const ContactSection = lazy(() => import('./sections/ContactSection').then(m => ({ default: m.ContactSection })));

function App() {
  return (
    <Router>
      <ThemeProvider>
        <div id="name" className="max-w-[920px] mx-auto relative scroll-pt-[90px]">
          <CommandPalette />
          <Dock />
          <IntroOverlay />
          <TooltipProvider />
          <Navbar />
          <main>
            <Suspense fallback={null}>
              <CliSection />
            </Suspense>
            <HeroSection />
            <Suspense fallback={null}>
              <ActivitySection />
            </Suspense>
            <Suspense fallback={null}>
              <GitHubContributionsSection />
            </Suspense>
            <Suspense fallback={null}>
              <ProjectsSection />
            </Suspense>
            <Suspense fallback={null}>
              <StackSection />
            </Suspense>
            <Suspense fallback={null}>
              <ContactSection />
            </Suspense>
          </main>
          <Footer />
        </div>
        <Analytics />
      </ThemeProvider>
    </Router>
  );
}

export default App;
