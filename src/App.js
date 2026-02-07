import React, { useRef, useState } from "react";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchResults from "./components/SearchResults/SearchResults";
import Playlist from "./components/Playlist/Playlist";
import Spotify from "./util/Spotify";
import "./App.css";

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
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const audioRef = useRef(null);
  
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
  const playPreview = (track) => {
    if (!track?.previewUrl) return;
  
    // toggle: if same track is playing, pause it
    if (playingTrackId === track.id) {
      audioRef.current?.pause();
      setPlayingTrackId(null);
      return;
    }
  
    // stop current audio if any
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  
    audioRef.current = new Audio(track.previewUrl);
  
    audioRef.current.onended = () => {
      setPlayingTrackId(null);
    };
  
    audioRef.current
      .play()
      .then(() => setPlayingTrackId(track.id))
      .catch(() => setPlayingTrackId(null));
  };
  
  const pausePreview = () => {
    audioRef.current?.pause();
    setPlayingTrackId(null);
  };

  return (
    <div className="App">
  <h1>Jammming</h1>

  <SearchBar onSearch={search} />

  <div className="App-playlist">
    <SearchResults
      searchResults={searchResults}
      onAdd={addTrack}
      playingTrackId={playingTrackId}
      onPlayPreview={playPreview}
      onPausePreview={pausePreview}
    />

    <Playlist
      playlistName={playlistName}
      playlistTracks={playlistTracks}
      onNameChange={setPlaylistName}
      onRemove={removeTrack}
      onSave={savePlaylist}
      playingTrackId={playingTrackId}
      onPlayPreview={playPreview}
      onPausePreview={pausePreview}
    />
  </div>
</div>

  );
}
