// Vercel Serverless Function for Spotify API
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

const getAccessToken = async () => {
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  return response.json();
};

const getNowPlaying = async () => {
  const { access_token } = await getAccessToken();

  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

const getRecentlyPlayed = async () => {
  const { access_token } = await getAccessToken();

  return fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

  try {
    // Try to get currently playing
    const nowPlayingResponse = await getNowPlaying();

    if (nowPlayingResponse.status === 200) {
      const song = await nowPlayingResponse.json();
      
      if (song && song.item) {
        return res.status(200).json({
          isPlaying: true,
          title: song.item.name,
          artist: song.item.artists.map((artist) => artist.name).join(', '),
          songUrl: song.item.external_urls.spotify,
        });
      }
    }

    // If nothing is playing, get recently played
    const recentlyPlayedResponse = await getRecentlyPlayed();
    
    if (recentlyPlayedResponse.status === 200) {
      const data = await recentlyPlayedResponse.json();
      
      if (data && data.items && data.items.length > 0) {
        const track = data.items[0].track;
        
        return res.status(200).json({
          isPlaying: false,
          recentTrack: {
            title: track.name,
            artist: track.artists.map((artist) => artist.name).join(', '),
            songUrl: track.external_urls.spotify,
          }
        });
      }
    }

    return res.status(200).json({ isPlaying: false });
  } catch (error) {
    console.error('Spotify API Error:', error);
    return res.status(200).json({ isPlaying: false });
  }
}
