export default function Track({ track, actionLabel, onAction }) {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h3 style={{ margin: 0 }}>{track.name}</h3>
          <p style={{ margin: 0 }}>
            {track.artist} | {track.album}
          </p>
        </div>
  
        <button onClick={() => onAction(track)}>{actionLabel}</button>
      </div>
    );
  }
  