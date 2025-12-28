import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useTheme } from '../contexts/ThemeContext';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };

    const openHandler = () => setOpen(true);

    document.addEventListener('keydown', down);
    window.addEventListener('openCommandPalette', openHandler);

    return () => {
      document.removeEventListener('keydown', down);
      window.removeEventListener('openCommandPalette', openHandler);
    };
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const scrollTo = (id: string) => {
    runCommand(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  // Custom filter: match whole words, not fuzzy characters
  const customFilter = (value: string, search: string): number => {
    const searchLower = search.toLowerCase().trim();
    const valueLower = value.toLowerCase();

    // Check if any word in value starts with the search term
    const words = valueLower.split(/\s+/);
    for (const word of words) {
      if (word.startsWith(searchLower)) {
        return 1; // Full match
      }
    }

    // Check if search is contained as a substring in value (for partial word matching)
    if (valueLower.includes(searchLower)) {
      return 0.5;
    }

    return 0; // No match
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Search"
      filter={customFilter}
      className="fixed inset-0 z-[99999]"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Search Container */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl px-4">
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden">

          {/* Search Input */}
          <Command.Input
            autoFocus
            placeholder="Search..."
            className="w-full px-5 py-4 bg-transparent outline-none text-[var(--text-color)] placeholder:text-[var(--text-muted)] text-base"
          />

          {/* Results */}
          <Command.List className="max-h-[320px] overflow-y-auto border-t border-[var(--border-color)]">
            <Command.Empty className="py-8 text-center text-sm text-[var(--text-muted)]">
              No results
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group className="p-2">
              <CommandItem
                value="home top start landing hero intro welcome beginning"
                onSelect={() => scrollTo('hero')}
              >
                Go to Home
              </CommandItem>

              <CommandItem
                value="projects work portfolio apps applications builds showcase"
                onSelect={() => scrollTo('projects')}
              >
                View Projects
              </CommandItem>

              <CommandItem
                value="stack skills tech technology tools languages frameworks expertise abilities"
                onSelect={() => scrollTo('skills')}
              >
                View Tech Stack
              </CommandItem>

              <CommandItem
                value="contact email reach connect message hire mail get in touch"
                onSelect={() => scrollTo('contact')}
              >
                Contact Me
              </CommandItem>

              <CommandItem
                value="contributions github activity commits code opensource open source"
                onSelect={() => scrollTo('contributions')}
              >
                GitHub Contributions
              </CommandItem>
            </Command.Group>

            <div className="h-px bg-[var(--border-color)] mx-2" />

            {/* Actions */}
            <Command.Group className="p-2">
              <CommandItem
                value="theme toggle dark light switch mode appearance color scheme night day"
                onSelect={() => runCommand(toggleTheme)}
              >
                {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </CommandItem>

              <CommandItem
                value="github profile code repository source"
                onSelect={() => runCommand(() => window.open('https://github.com/TirthDhandhukia30', '_blank'))}
              >
                Open GitHub
              </CommandItem>

              <CommandItem
                value="linkedin professional network career"
                onSelect={() => runCommand(() => window.open('https://www.linkedin.com/in/tirthdhandhukia/', '_blank'))}
              >
                Open LinkedIn
              </CommandItem>

              <CommandItem
                value="twitter x social"
                onSelect={() => runCommand(() => window.open('https://twitter.com', '_blank'))}
              >
                Open Twitter
              </CommandItem>

              <CommandItem
                value="copy link url share clipboard"
                onSelect={() => runCommand(() => navigator.clipboard.writeText(window.location.href))}
              >
                Copy Page Link
              </CommandItem>
            </Command.Group>
          </Command.List>
        </div>

        {/* Hint */}
        <div className="flex justify-center mt-3">
          <span className="text-[11px] text-[var(--text-muted)] opacity-60">
            ↑↓ to navigate · ↵ to select · esc to close
          </span>
        </div>
      </div>
    </Command.Dialog>
  );
}

function CommandItem({
  children,
  value,
  onSelect
}: {
  children: React.ReactNode;
  value: string;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="px-3 py-2.5 rounded-lg text-sm text-[var(--text-color)] cursor-default select-none data-[selected=true]:bg-[var(--hover-bg-color)] transition-colors"
    >
      {children}
    </Command.Item>
  );
}
