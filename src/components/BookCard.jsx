import { coverUrl } from "../lib/openLibrary.js";
import { spineVarFor } from "../lib/spineColor.js";
import "./BookCard.css";

export default function BookCard({ book, saved, onOpen, onToggleSave, stampedOn }) {
  const cover = coverUrl(book.cover_i, "M");
  const author = book.author_name?.[0] || "Unknown author";

  return (
    <div className="book-card">
      <button className="book-card-cover" onClick={() => onOpen(book)} aria-label={`View details for ${book.title}`}>
        {cover ? (
          <img src={cover} alt="" loading="lazy" />
        ) : (
          <div className="book-card-placeholder" style={{ background: spineVarFor(book.title) }}>
            <span>{book.title}</span>
          </div>
        )}
        {saved && (
          <div className="stamp-badge" aria-hidden="true">
            <span>{stampedOn ? "checked out" : "saved"}</span>
          </div>
        )}
      </button>

      <div className="book-card-body">
        <button className="book-card-title" onClick={() => onOpen(book)}>
          {book.title}
        </button>
        <p className="book-card-author">{author}</p>
        <div className="book-card-meta mono-label">
          {book.first_publish_year && <span>{book.first_publish_year}</span>}
          {stampedOn && <span>· saved {stampedOn}</span>}
        </div>
      </div>

      <button
        className={`btn book-card-save ${saved ? "is-saved" : ""}`}
        onClick={() => onToggleSave(book)}
      >
        {saved ? "Remove" : "Save to list"}
      </button>
    </div>
  );
}
