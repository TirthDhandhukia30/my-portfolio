import { SparklesSection } from '../components/SparklesSection';
import { ContributionGraph } from '../components/ContributionGraph';
import { useGitHubContributions } from '../hooks/useGitHubContributions';

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="contribution-loading">
      <div className="contribution-spinner" />
      <span className="contribution-loading-text">Loading contributions...</span>
    </div>
  );
}

// Legend component
function ContributionLegend() {
  return (
    <div className="contribution-legend">
      <span className="contribution-legend-label">Less</span>
      <div className="contribution-legend-blocks">
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`contribution-legend-block level-${level}`}
            data-tooltip={`Level ${level}`}
          />
        ))}
      </div>
      <span className="contribution-legend-label">More</span>
    </div>
  );
}

export function GitHubContributionsSection() {
  const { data, totalContributions, isLoading, error, username } = useGitHubContributions();

  return (
    <SparklesSection
      id="contributions"
      className="scroll-section relative bg-[var(--bg-color)] text-[var(--text-color)] py-14 px-6 transition-colors duration-300
        before:content-[''] before:absolute before:left-1/2 before:top-0 before:-translate-x-1/2 before:w-screen before:border-t before:border-dashed before:border-[var(--edge)] before:h-0 before:pointer-events-none before:z-0 before:transition-colors before:duration-300
        max-md:py-[80px] max-md:px-8
        max-sm:py-[50px] max-sm:px-5
        max-[480px]:py-14 max-[480px]:px-4
        max-[360px]:py-[40px] max-[360px]:px-3"
    >
      <div className="max-w-[700px] mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-[var(--text-color)] tracking-[-0.025em]">
          GitHub Activity
        </h2>

        {isLoading && <LoadingSpinner />}

        {error && (
          <div className="contribution-error">
            <span className="contribution-error-icon">⚠️</span>
            <span>Failed to load contributions</span>
          </div>
        )}

        {!isLoading && !error && data && (
          <>
            {/* Graph section - scrollable on mobile */}
            <div className="contribution-graph-scroll">
              <ContributionGraph
                data={data}
                blockSize={12}
                blockMargin={3}
                blockRadius={2}
              />
            </div>

            {/* Footer with total and legend */}
            <div className="contribution-footer-simple">
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contribution-total-link"
              >
                <span className="contribution-total">
                  {totalContributions.toLocaleString()} contributions in the last year on GitHub
                </span>
              </a>
              <ContributionLegend />
            </div>
          </>
        )}
      </div>
    </SparklesSection>
  );
}

