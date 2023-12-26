const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID; // See .env file
const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI; // See .env file

let accessToken;

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
      console.log('Access token successfully obtained:', accessToken);
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      console.log('Redirecting to Spotify for authentication');
      window.location = accessUrl;
    }
  },

  async search(term) {
    const accessToken = await this.getAccessToken();
    return fetch(
      `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request failed!');
    }, networkError => console.log(networkError.message))
    .then(jsonResponse => {
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
    })
    .catch(error => {
      console.error("Spotify API error during search:", error);
      return []; // Return an empty array or handle the error as needed
    });
  },

  async savePlaylist(name, trackUris) {
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
  },
};

export default Spotify;
