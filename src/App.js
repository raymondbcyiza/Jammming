import { useState } from "react";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchResults from "./components/SearchResults/SearchResults";
import Playlist from "./components/Playlist/Playlist";
import Spotify from "./util/Spotify";

// Temporary data until Spotify API is hooked up
const MOCK_TRACKS = [
  { id: "1", name: "Nights", artist: "Frank Ocean", album: "Blonde", uri: "spotify:track:1" },
  { id: "2", name: "Reckoner", artist: "Radiohead", album: "In Rainbows", uri: "spotify:track:2" },
  { id: "3", name: "Roygbiv", artist: "Boards of Canada", album: "MHTRTC", uri: "spotify:track:3" },
];

export default function App() {
  // App owns all the important state
  const [searchResults, setSearchResults] = useState(MOCK_TRACKS);
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);

  function addTrack(track) {
    setPlaylistTracks((prev) => {
      // prevent duplicates
      if (prev.some((t) => t.id === track.id)) return prev;
      return [...prev, track];
    });
  }

  function removeTrack(track) {
    setPlaylistTracks((prev) => prev.filter((t) => t.id !== track.id));
  }

  function updatePlaylistName(name) {
    setPlaylistName(name);
  }

  async function search(term) {
    try {
      const results = await Spotify.search(term);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
      alert("Search failed. Check console for details.");
    }
  }
  
  async function savePlaylist() {
    try {
      const trackUris = playlistTracks.map((t) => t.uri);
      await Spotify.savePlaylist(playlistName, trackUris);
  
      // Nice UX: reset after saving
      setPlaylistName("New Playlist");
      setPlaylistTracks([]);
      alert("Playlist saved to Spotify!");
    } catch (err) {
      console.error(err);
      alert("Save failed. Check console for details.");
    }
  }

  return (
    <div>
      <h1>Jammming</h1>

      <SearchBar onSearch={search} />

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <SearchResults searchResults={searchResults} onAdd={addTrack} />
        <Playlist
          playlistName={playlistName}
          playlistTracks={playlistTracks}
          onRemove={removeTrack}
          onNameChange={updatePlaylistName}
          onSave={savePlaylist}
        />
      </div>
    </div>
  );
}
