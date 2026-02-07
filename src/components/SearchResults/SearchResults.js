import Tracklist from "../Tracklist/Tracklist";

export default function SearchResults({ searchResults, onAdd }) {
  return (
    <div>
      <h2>Search Results</h2>
      <Tracklist tracks={searchResults} actionLabel="+" onAction={onAdd} />
    </div>
  );
}
