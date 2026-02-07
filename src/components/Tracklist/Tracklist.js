import React from "react";
import Track from "../Track/Track";

const Tracklist = ({
  tracks,
  actionLabel,
  onAction,
  playingTrackId,
  onPlayPreview,
  onPausePreview,
}) => {
  if (!tracks || tracks.length === 0) {
    return <div>No tracks.</div>;
  }

  return (
    <div className="TrackList">
      {tracks.map((track) => (
        <Track
          key={track.id}
          track={track}
          actionLabel={actionLabel}
          onAction={onAction}
          playingTrackId={playingTrackId}
          onPlayPreview={onPlayPreview}
          onPausePreview={onPausePreview}
        />
      ))}
    </div>
  );
};

export default Tracklist;
