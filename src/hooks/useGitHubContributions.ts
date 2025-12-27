import { useState, useEffect } from 'react';
import { GITHUB_CONTRIBUTIONS_API, CACHE_DURATION, GITHUB_USERNAME } from '../config/github';
import type { ContributionDay } from '../components/ContributionGraph';

interface GitHubContributionsResponse {
  contributions: ContributionDay[];
  total: {
    lastYear?: number;
    [year: string]: number | undefined;
  };
}

interface UseGitHubContributionsResult {
  data: ContributionDay[] | null;
  totalContributions: number;
  isLoading: boolean;
  error: string | null;
  username: string;
}

const CACHE_KEY = `github-contributions-cache-${GITHUB_USERNAME}`;

interface CacheData {
  timestamp: number;
  data: GitHubContributionsResponse;
}

function getFromCache(): GitHubContributionsResponse | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { timestamp, data }: CacheData = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid (24 hours)
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }

    // Cache expired, remove it
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch {
    return null;
  }
}

function saveToCache(data: GitHubContributionsResponse): void {
  try {
    const cacheData: CacheData = {
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch {
    // Silently fail if localStorage is full or unavailable
  }
}

// Clear old cache when username changes
function clearOldCache(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('github-contributions-cache-') && key !== CACHE_KEY) {
        localStorage.removeItem(key);
      }
    });
  } catch {
    // Silently fail
  }
}

export function useGitHubContributions(): UseGitHubContributionsResult {
  const [data, setData] = useState<ContributionDay[] | null>(null);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clear old caches from different usernames
    clearOldCache();

    async function fetchContributions() {
      setIsLoading(true);
      setError(null);

      // Check cache first
      const cachedData = getFromCache();
      if (cachedData) {
        setData(cachedData.contributions);
        // Get total - API returns { lastYear: number }
        const total = cachedData.total?.lastYear ??
          Object.values(cachedData.total || {}).reduce<number>((sum, val) => (sum || 0) + (val || 0), 0);
        setTotalContributions(total || 0);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(GITHUB_CONTRIBUTIONS_API);

        if (!response.ok) {
          throw new Error(`Failed to fetch contributions: ${response.status}`);
        }

        const responseData: GitHubContributionsResponse = await response.json();

        // Save to cache
        saveToCache(responseData);

        setData(responseData.contributions);
        // Get total - API returns { lastYear: number }
        const total = responseData.total?.lastYear ??
          Object.values(responseData.total || {}).reduce<number>((sum, val) => (sum || 0) + (val || 0), 0);
        setTotalContributions(total || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch contributions');
      } finally {
        setIsLoading(false);
      }
    }

    fetchContributions();
  }, []);

  return {
    data,
    totalContributions,
    isLoading,
    error,
    username: GITHUB_USERNAME,
  };
}

