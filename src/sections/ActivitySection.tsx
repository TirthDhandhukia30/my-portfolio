import { useState, useEffect } from 'react';
import { SparklesSection } from '../components/SparklesSection';

const DISCORD_USER_ID = '802435240081489920';
const LAST_PLAYED_KEY = 'spotify_last_played';

interface SpotifyData {
  song: string;
  artist: string;
  album_art_url: string;
  track_id: string;
}

interface LanyardData {
  listening_to_spotify: boolean;
  spotify: SpotifyData | null;
}

// Helper to get last played from localStorage
const getLastPlayed = (): SpotifyData | null => {
  try {
    const stored = localStorage.getItem(LAST_PLAYED_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// Helper to save last played to localStorage
const saveLastPlayed = (data: SpotifyData) => {
  try {
    localStorage.setItem(LAST_PLAYED_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
};

export function ActivitySection() {
  const [lanyard, setLanyard] = useState<LanyardData | null>(null);
  const [lastPlayed, setLastPlayed] = useState<SpotifyData | null>(getLastPlayed);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let heartbeatId: ReturnType<typeof setInterval> | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    // Initial fetch to get data immediately
    const fetchLanyard = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
        const data = await res.json();
        if (data.success) {
          const spotifyData = data.data.spotify;
          setLanyard({
            listening_to_spotify: data.data.listening_to_spotify,
            spotify: spotifyData,
          });
          if (data.data.listening_to_spotify && spotifyData) {
            saveLastPlayed(spotifyData);
            setLastPlayed(spotifyData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch Lanyard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanyard();

    // Set up WebSocket for real-time updates
    const connectWebSocket = () => {
      ws = new WebSocket('wss://api.lanyard.rest/socket');

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.op === 1) {
          // Hello event - start heartbeat and subscribe
          const heartbeatInterval = message.d.heartbeat_interval;

          // Send subscribe message after receiving hello
          ws?.send(JSON.stringify({
            op: 2,
            d: { subscribe_to_id: DISCORD_USER_ID },
          }));

          // Start heartbeat
          heartbeatId = setInterval(() => {
            if (ws?.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ op: 3 }));
            }
          }, heartbeatInterval);
        }

        if (message.op === 0 && message.t === 'INIT_STATE') {
          const spotifyData = message.d.spotify;
          setLanyard({
            listening_to_spotify: message.d.listening_to_spotify,
            spotify: spotifyData,
          });
          if (message.d.listening_to_spotify && spotifyData) {
            saveLastPlayed(spotifyData);
            setLastPlayed(spotifyData);
          }
          setIsLoading(false);
        }

        if (message.op === 0 && message.t === 'PRESENCE_UPDATE') {
          const spotifyData = message.d.spotify;
          setLanyard({
            listening_to_spotify: message.d.listening_to_spotify,
            spotify: spotifyData,
          });
          if (message.d.listening_to_spotify && spotifyData) {
            saveLastPlayed(spotifyData);
            setLastPlayed(spotifyData);
          }
        }
      };

      ws.onclose = () => {
        // Reconnect after 5 seconds
        if (heartbeatId) clearInterval(heartbeatId);
        reconnectTimeout = setTimeout(connectWebSocket, 5000);
      };

      ws.onerror = () => {
        ws?.close();
      };
    };

    connectWebSocket();

    return () => {
      if (heartbeatId) clearInterval(heartbeatId);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      ws?.close();
    };
  }, []);

  const isListening = lanyard?.listening_to_spotify && lanyard?.spotify;
  const spotify = lanyard?.spotify;
  const displayData = isListening ? spotify : lastPlayed;
  const hasDisplayData = !!displayData;

  return (
    <SparklesSection
      id="githubActivity"
      className="scroll-section py-4 px-16 flex justify-center items-center bg-[var(--bg-color)] mb-5 transition-colors duration-300
        max-md:py-[14px] max-md:px-8
        max-sm:py-3 max-sm:px-5
        max-[480px]:py-2 max-[480px]:px-4"
    >
      <div className="flex gap-4 items-center flex-wrap justify-center max-sm:gap-2.5">
        {/* Currently Building */}
        <a
          href="https://readDocs.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(128,128,128,0.08)] border border-[rgba(255,255,255,0.15)] opacity-85 rounded transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer no-underline
            hover:bg-[rgba(128,128,128,0.15)] hover:opacity-100 hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.25)]
            light-theme:bg-transparent light-theme:border-[rgba(0,0,0,0.12)]
            max-sm:px-3 max-sm:py-[7px] max-sm:gap-2
            max-[480px]:px-2.5 max-[480px]:py-1.5 max-[480px]:gap-[7px]"
        >
          <i className="fa-brands fa-github text-lg text-[var(--text-color)] flex-shrink-0 opacity-90 max-sm:text-sm max-[480px]:text-[13px]" />
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-xs font-semibold text-[var(--text-color)] opacity-95 m-0 tracking-[0.02em] max-sm:text-[11px] max-[480px]:text-[10px]">
              Currently Building
            </p>
            <p className="text-[11px] text-[var(--text-color)] opacity-60 m-0 font-medium max-sm:text-[9px] max-[480px]:text-[8px]">
              readDocs
            </p>
          </div>
        </a>

        {/* Spotify Activity - Lanyard Integration */}
        <a
          href={hasDisplayData ? `https://open.spotify.com/track/${displayData?.track_id}` : 'https://open.spotify.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(128,128,128,0.08)] border border-[rgba(255,255,255,0.15)] opacity-85 rounded transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer no-underline
            hover:bg-[rgba(128,128,128,0.15)] hover:opacity-100 hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.25)]
            light-theme:bg-transparent light-theme:border-[rgba(0,0,0,0.12)]
            max-sm:px-3 max-sm:py-[7px] max-sm:gap-2
            max-[480px]:px-2.5 max-[480px]:py-1.5 max-[480px]:gap-[7px]"
        >
          {/* Album Art or Spotify Icon */}
          {hasDisplayData && displayData?.album_art_url ? (
            <img
              src={displayData.album_art_url}
              alt="Album Art"
              className={`w-5 h-5 rounded flex-shrink-0 object-cover ${!isListening ? 'opacity-60 grayscale-[30%]' : ''}`}
            />
          ) : (
            <i className="fa-brands fa-spotify text-lg text-[#1DB954] flex-shrink-0 opacity-90 max-sm:text-sm max-[480px]:text-[13px]" />
          )}

          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            {isLoading ? (
              <>
                <p className="text-xs font-semibold text-[var(--text-color)] opacity-95 m-0 tracking-[0.02em] max-sm:text-[11px]">
                  Loading...
                </p>
                <p className="text-[11px] text-[var(--text-color)] opacity-60 m-0 font-medium max-sm:text-[9px]">
                  Spotify
                </p>
              </>
            ) : hasDisplayData ? (
              <>
                <p className="text-xs font-semibold text-[var(--text-color)] opacity-95 m-0 overflow-hidden text-ellipsis whitespace-nowrap tracking-[0.02em] max-sm:text-[11px]">
                  {displayData.song}
                </p>
                <p className="text-[11px] text-[var(--text-color)] opacity-60 m-0 overflow-hidden text-ellipsis whitespace-nowrap font-medium max-sm:text-[9px]">
                  {isListening ? displayData.artist : `${displayData.artist} • Last Played`}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold text-[var(--text-color)] opacity-95 m-0 tracking-[0.02em] max-sm:text-[11px]">
                  Not Playing
                </p>
                <p className="text-[11px] text-[var(--text-color)] opacity-60 m-0 font-medium max-sm:text-[9px]">
                  Spotify
                </p>
              </>
            )}
          </div>

          {/* Playing indicator - only show when actively listening */}
          {isListening && (
            <div className="flex gap-[2px] items-end h-3 flex-shrink-0">
              <span className="w-[3px] bg-[#1DB954] rounded-sm animate-[equalizer_0.8s_ease-in-out_infinite]" style={{ height: '60%', animationDelay: '0s' }} />
              <span className="w-[3px] bg-[#1DB954] rounded-sm animate-[equalizer_0.8s_ease-in-out_infinite]" style={{ height: '100%', animationDelay: '0.2s' }} />
              <span className="w-[3px] bg-[#1DB954] rounded-sm animate-[equalizer_0.8s_ease-in-out_infinite]" style={{ height: '40%', animationDelay: '0.4s' }} />
            </div>
          )}
        </a>
      </div>
    </SparklesSection>
  );
}


