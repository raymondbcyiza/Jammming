// src/util/Spotify.js
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;

// Scopes needed to create playlists + add tracks
// (You can choose public or private; keep both for flexibility)
const scopes = ["playlist-modify-public", "playlist-modify-private"];

const authEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const apiBase = "https://api.spotify.com/v1";

const Spotify = {
  async getAccessToken() {
    // 1) If we already have a valid access token in sessionStorage, return it.
    const cached = sessionStorage.getItem("spotify_access_token");
    const cachedExpiry = sessionStorage.getItem("spotify_access_token_expires_at");
    if (cached && cachedExpiry && Date.now() < Number(cachedExpiry)) {
      return cached;
    }

    // 2) If we came back from Spotify with a code, exchange it for tokens.
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      const verifier = sessionStorage.getItem("spotify_code_verifier");
      if (!verifier) throw new Error("Missing PKCE code verifier.");

      const body = new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: verifier,
      });

      const resp = await fetch(tokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Token exchange failed: ${text}`);
      }

      const data = await resp.json();

      // Cache token
      const expiresAt = Date.now() + data.expires_in * 1000;
      sessionStorage.setItem("spotify_access_token", data.access_token);
      sessionStorage.setItem("spotify_access_token_expires_at", String(expiresAt));

      // Optional: store refresh token if you plan to implement refresh flow
      if (data.refresh_token) {
        sessionStorage.setItem("spotify_refresh_token", data.refresh_token);
      }

      // Clean URL (remove ?code=...&state=...)
      window.history.replaceState({}, document.title, window.location.pathname);

      return data.access_token;
    }

    // 3) Otherwise, start PKCE auth (redirect to Spotify)
    await this._redirectToAuthorize();
    // This line won't really run because the browser redirects
    return null;
  },

  async search(term) {
    if (!term) return [];
    const token = await this.getAccessToken();
    if (!token) return [];

    const url = `${apiBase}/search?type=track&q=${encodeURIComponent(term)}`;
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Search failed: ${text}`);
    }

    const json = await resp.json();
    const items = json.tracks?.items ?? [];

    // Return simplified track objects your app uses everywhere
    return items.map((t) => ({
        id: t.id,
        name: t.name,
        artist: t.artists?.[0]?.name ?? "Unknown",
        album: t.album?.name ?? "Unknown",
        uri: t.uri,
      
        // ✅ NEW: 30s preview MP3 URL (can be null)
        previewUrl: t.preview_url ?? null,
      
        // ✅ OPTIONAL fallback link
        externalUrl: t.external_urls?.spotify ?? null,
      }));
  },

  async savePlaylist(playlistName, trackUris) {
    if (!playlistName || !trackUris?.length) return;

    const token = await this.getAccessToken();
    if (!token) return;

    // 1) Get current user id
    const meResp = await fetch(`${apiBase}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!meResp.ok) {
      const text = await meResp.text();
      throw new Error(`Fetching user failed: ${text}`);
    }
    const me = await meResp.json();

    // 2) Create playlist (Spotify API: Create Playlist) :contentReference[oaicite:1]{index=1}
    const createResp = await fetch(`${apiBase}/users/${me.id}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playlistName,
        description: "Created with Jammming",
        public: false,
      }),
    });

    if (!createResp.ok) {
      const text = await createResp.text();
      throw new Error(`Create playlist failed: ${text}`);
    }

    const playlist = await createResp.json();

    // 3) Add tracks (Spotify API: Add Items to Playlist) :contentReference[oaicite:2]{index=2}
    const addResp = await fetch(`${apiBase}/playlists/${playlist.id}/tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris: trackUris }),
    });

    if (!addResp.ok) {
      const text = await addResp.text();
      throw new Error(`Add tracks failed: ${text}`);
    }
  },

  async _redirectToAuthorize() {
    if (!clientId || !redirectUri) {
      throw new Error(
        "Missing env vars. Set REACT_APP_SPOTIFY_CLIENT_ID and REACT_APP_SPOTIFY_REDIRECT_URI."
      );
    }

    const verifier = this._generateRandomString(64);
    sessionStorage.setItem("spotify_code_verifier", verifier);

    const challenge = await this._pkceChallengeFromVerifier(verifier);

    const authUrl = new URL(authEndpoint);
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", scopes.join(" "));
    authUrl.searchParams.set("code_challenge_method", "S256");
    authUrl.searchParams.set("code_challenge", challenge);

    window.location.assign(authUrl.toString());
  },

  _generateRandomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    array.forEach((x) => (result += chars[x % chars.length]));
    return result;
  },

  async _pkceChallengeFromVerifier(verifier) {
    const data = new TextEncoder().encode(verifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  },
};

export default Spotify;
