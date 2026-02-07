import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [term, setTerm] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(term);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search songs, artists, albums..."
      />
      <button type="submit">Search</button>
    </form>
  );
}
