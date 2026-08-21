import { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ onSearch, onClear }) {
  const [value, setValue] = useState("");

  function submit(e) {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  }

  function clear() {
    setValue("");
    onClear();
  }

  return (
    <form className="catalog-search" onSubmit={submit} role="search">
      <span className="mono-label catalog-search-tab">catalog search</span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by title or author…"
        aria-label="Search books by title or author"
      />
      {value && (
        <button type="button" className="btn btn-ghost" onClick={clear}>
          Clear
        </button>
      )}
      <button type="submit" className="btn btn-primary">Search</button>
    </form>
  );
}
