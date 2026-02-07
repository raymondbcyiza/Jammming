import Track from "../Track/Track";

export default function Tracklist({ tracks, actionLabel, onAction }) {
  return (
    <div>
      {tracks.map((track) => (
        <Track
          key={track.id}
          track={track}
          actionLabel={actionLabel}
          onAction={onAction}
        />
      ))}
    </div>
  );
}
