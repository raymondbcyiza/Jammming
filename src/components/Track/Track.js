const Track = ({
    track,
    actionLabel,
    onAction,
    playingTrackId,
    onPlayPreview,
    onPausePreview,
  }) => {
    const hasPreview = Boolean(track.previewUrl);
    const isPlaying = playingTrackId === track.id;
  
    return (
      <div className="Track" style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div className="Track-information">
          <h3 style={{ margin: 0 }}>{track.name}</h3>
          <p style={{ margin: 0 }}>
            {track.artist} | {track.album}
          </p>
        </div>
  
        <div style={{ display: "flex", gap: 8 }}>
          {/* 🎵 PREVIEW BUTTON */}
          <button
            className="Track-preview"
            type="button"
            disabled={!hasPreview}
            onClick={() =>
              isPlaying ? onPausePreview() : onPlayPreview(track)
            }
          >
            {hasPreview ? (isPlaying ? "Pause" : "Play") : "No preview"}
          </button>
  
          {/* ➕ / ➖ ADD OR REMOVE BUTTON */}
          <button className="Track-action" onClick={() => onAction(track)}>{actionLabel}</button>
        </div>
      </div>
    );
  };
  
  export default Track;
  