import React from "react";
import Tracklist from "../Tracklist/Tracklist";

const SearchResults = ({
  searchResults,
  onAdd,
  playingTrackId,
  onPlayPreview,
  onPausePreview,
}) => {
  return (
    <div className="SearchResults">
      <h2>Search Results</h2>
      <Tracklist
        tracks={searchResults}
        actionLabel="+"
        onAction={onAdd}
        playingTrackId={playingTrackId}
        onPlayPreview={onPlayPreview}
        onPausePreview={onPausePreview}
      />
    </div>
  );
};

export default SearchResults;
