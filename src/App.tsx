import { BrowserRouter as Router } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from './contexts/ThemeContext';
import { TooltipProvider } from './components/Tooltip';
import { IntroOverlay } from './components/IntroOverlay';
import { CommandPalette } from './components/CommandPalette';
import { Dock } from './components/Dock';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CliSection } from './sections/CliSection';
import { HeroSection } from './sections/HeroSection';
import { ActivitySection } from './sections/ActivitySection';
import { ProjectsSection } from './sections/ProjectsSection';
import { StackSection } from './sections/StackSection';
import { GitHubContributionsSection } from './sections/GitHubContributionsSection';
import { ContactSection } from './sections/ContactSection';

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
            <CliSection />
            <HeroSection />
            <ActivitySection />
            <GitHubContributionsSection />
            <ProjectsSection />
            <StackSection />
            <ContactSection />
          </main>
          <Footer />
        </div>
        <Analytics />
      </ThemeProvider>
    </Router>
  );
}

export default App;
