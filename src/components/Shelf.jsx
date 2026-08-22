import { useEffect, useState } from "react";
import { getSubjectBooks } from "../lib/openLibrary.js";
import BookCard from "./BookCard.jsx";
import "./Shelf.css";

const GENRES = [
  { subject: "fiction", label: "Fiction", spine: "--spine-1" },
  { subject: "fantasy", label: "Fantasy", spine: "--spine-5" },
  { subject: "mystery_and_detective_stories", label: "Mystery", spine: "--spine-7" },
  { subject: "romance", label: "Romance", spine: "--spine-4" },
  { subject: "science_fiction", label: "Sci-Fi", spine: "--spine-3" },
  { subject: "biography", label: "Biography", spine: "--spine-6" },
  { subject: "history", label: "History", spine: "--spine-8" },
  { subject: "poetry", label: "Poetry", spine: "--spine-2" },
  { subject: "business", label: "Business", spine: "--spine-6" },
  { subject: "sports", label: "Sports", spine: "--spine-3" },
  { subject: "self_help", label: "Self-Help", spine: "--spine-2" },
  { subject: "horror", label: "Horror", spine: "--spine-1" },
  { subject: "cooking", label: "Cooking", spine: "--spine-4" },
  { subject: "humor", label: "Humor", spine: "--spine-8" },
  { subject: "young_adult_fiction", label: "Young Adult", spine: "--spine-5" },
  { subject: "thriller", label: "Thriller", spine: "--spine-7" },
  { subject: "classics", label: "Classics", spine: "--spine-2" },
  { subject: "philosophy", label: "Philosophy", spine: "--spine-6" },
  { subject: "travel", label: "Travel", spine: "--spine-3" },
  { subject: "art", label: "Art", spine: "--spine-1" },
  { subject: "children", label: "Children's", spine: "--spine-4" },
  { subject: "psychology", label: "Psychology", spine: "--spine-8" },
  { subject: "drama", label: "Drama", spine: "--spine-5" },
  { subject: "music", label: "Music", spine: "--spine-7" },
];

export default function Shelf({ isSaved, onOpen, onToggleSave }) {
  const [active, setActive] = useState(GENRES[0].subject);
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    getSubjectBooks(active, 24)
      .then((data) => {
        if (cancelled) return;
        setBooks(data.filter((b) => b.title));
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => { cancelled = true; };
  }, [active]);

  const activeGenre = GENRES.find((g) => g.subject === active);

  return (
    <section className="shelf-section">
      <div className="shelf-heading">
        <p className="mono-label">Pick a shelf</p>
        <h1>Pull something off the shelf.</h1>
        <p className="shelf-sub">
          Browse by genre the way you would in a library — no algorithm feed,
          just shelves. Tap a spine to see what's on it.
        </p>
      </div>

      <div className="wood-shelf" role="tablist" aria-label="Genres">
        {GENRES.map((g, i) => (
          <button
            key={g.subject}
            role="tab"
            aria-selected={active === g.subject}
            className={`spine ${active === g.subject ? "is-active" : ""}`}
            style={{
              background: `var(${g.spine})`,
              width: 44 + ((i * 7) % 22) + "px",
            }}
            onClick={() => setActive(g.subject)}
          >
            <span>{g.label}</span>
          </button>
        ))}
      </div>
      <div className="shelf-ledge" aria-hidden="true" />

      <div className="shelf-results">
        {status === "loading" && (
          <p className="mono-label shelf-status">fetching the {activeGenre?.label.toLowerCase()} shelf…</p>
        )}
        {status === "error" && (
          <p className="mono-label shelf-status">
            Couldn't reach the catalog. Check your connection and try another shelf.
          </p>
        )}
        {status === "ready" && books.length === 0 && (
          <p className="mono-label shelf-status">Nothing catalogued here yet.</p>
        )}
        {status === "ready" && books.length > 0 && (
          <div className="book-grid">
            {books.map((book) => (
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
      </div>
    </section>
  );
}
