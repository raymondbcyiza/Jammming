import React from "react";
import Tracklist from "../Tracklist/Tracklist";

const Playlist = ({
  playlistName,
  playlistTracks,
  onNameChange,
  onRemove,
  onSave,
  playingTrackId,
  onPlayPreview,
  onPausePreview,
}) => {
  return (
    <div className="Playlist">
      <h2>Your Playlist</h2>

      <input
        value={playlistName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="New Playlist Name"
      />

      <Tracklist
        tracks={playlistTracks}
        actionLabel="-"
        onAction={onRemove}
        playingTrackId={playingTrackId}
        onPlayPreview={onPlayPreview}
        onPausePreview={onPausePreview}
      />

      <button onClick={onSave}>SAVE TO SPOTIFY</button>
    </div>
  );
};

export default Playlist;
