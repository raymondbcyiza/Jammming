import Tracklist from "../Tracklist/Tracklist";

export default function Playlist({
  playlistName,
  playlistTracks,
  onRemove,
  onNameChange,
  onSave,
}) {
  return (
    <div>
      <h2>Playlist</h2>

      <input
        value={playlistName}
        onChange={(e) => onNameChange(e.target.value)}
      />

      <Tracklist tracks={playlistTracks} actionLabel="-" onAction={onRemove} />

      <button onClick={onSave}>Save To Spotify</button>
    </div>
  );
}
