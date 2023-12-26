const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID; // See .env file
const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI; // See .env file

let accessToken;
let codeVerifier = generateRandomString(64);

function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

function base64urlencode(buffer) {
  let binary = '';
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const Spotify = {
  async getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    } else {
      let codeChallenge = await sha256(codeVerifier);
      codeChallenge = base64urlencode(codeChallenge);
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&scope=playlist-modify-public&redirect_uri=${redirectUri}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
      window.location = accessUrl;
    }
  },

  async fetchAccessToken(code) {
    try {
      const tokenUrl = 'https://accounts.spotify.com/api/token';
      const body = new URLSearchParams();
      body.append('grant_type', 'authorization_code');
      body.append('code', code);
      body.append('redirect_uri', redirectUri);
      body.append('client_id', clientId);
      body.append('code_verifier', codeVerifier);

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
      });

      const jsonResponse = await response.json();
      if (!response.ok) {
        throw new Error(jsonResponse.error_description || 'Failed to fetch access token');
      }

      accessToken = jsonResponse.access_token;
      window.setTimeout(() => accessToken = '', jsonResponse.expires_in * 1000);
    } catch (error) {
      console.error("Spotify API error during fetchAccessToken:", error);
    }
  },

  async search(term) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Request failed!');
      }

      const jsonResponse = await response.json();
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
      }));

    } catch (error) {
      console.error("Spotify API error during search:", error);
      return []; // Return an empty array or handle the error as needed
    }
  },

  async savePlaylist(name, trackUris) {
    try {
      if (!name || !trackUris.length) {
        return;
      }

      const accessToken = await this.getAccessToken();
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user information!');
      }

      const jsonResponse = await response.json();
      const userId = jsonResponse.id;
      const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name })
      });

      if (!playlistResponse.ok) {
        throw new Error('Failed to create playlist!');
      }

      const playlistJsonResponse = await playlistResponse.json();
      const playlistId = playlistJsonResponse.id;
      const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uris: trackUris })
      });

      if (!tracksResponse.ok) {
        throw new Error('Failed to add tracks to the playlist!');
      }
    } catch (error) {
      console.error("Spotify API error during savePlaylist:", error);
    }
  },
};

export default Spotify;
