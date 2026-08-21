import { useState } from "react";
import { searchBooks } from "../lib/openLibrary.js";
import SearchBar from "./SearchBar.jsx";
import BookCard from "./BookCard.jsx";
import Shelf from "./Shelf.jsx";

export default function BrowseView({ isSaved, onOpen, onToggleSave }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");

  async function handleSearch(q) {
    setQuery(q);
    setStatus("loading");
    try {
      const data = await searchBooks(q, 24);
      setResults(data.filter((b) => b.title));
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  function handleClear() {
    setQuery("");
    setResults([]);
    setStatus("idle");
  }

  return (
    <div className="container">
      <div style={{ paddingTop: "var(--space-4)" }}>
        <SearchBar onSearch={handleSearch} onClear={handleClear} />
      </div>

      {query ? (
        <section style={{ paddingBottom: "var(--space-5)" }}>
          <p className="mono-label" style={{ marginBottom: "var(--space-3)" }}>
            {status === "loading" && `searching for "${query}"…`}
            {status === "error" && "search failed — try again"}
            {status === "ready" && `${results.length} result${results.length === 1 ? "" : "s"} for "${query}"`}
          </p>
          {status === "ready" && (
            <div className="book-grid">
              {results.map((book) => (
                <BookCard
                  key={book.key}
                  book={book}
                  saved={isSaved(book.key)}
                  onOpen={onOpen}
                  onToggleSave={onToggleSave}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <Shelf isSaved={isSaved} onOpen={onOpen} onToggleSave={onToggleSave} />
      )}
    </div>
  );
}
