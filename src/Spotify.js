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

function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

function base64urlencode(a) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(a)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
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
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
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
    if (jsonResponse.access_token) {
      accessToken = jsonResponse.access_token;
      window.setTimeout(() => accessToken = '', jsonResponse.expires_in * 1000);
      // Handle refresh token if needed
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(
      `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then(
      (response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Request failed!");
      },
      (networkError) => console.log(networkError.message)
    )
    .then((jsonResponse) => {
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
      }));
    })
    .catch((error) => {
      console.error("Spotify API error:", error);
    });
  },

  // Other methods...
};

export default Spotify;
