import BookCard from "./BookCard.jsx";
import "./ReadingList.css";

export default function ReadingList({ items, onOpen, onToggleSave, onGoToReader }) {
  return (
    <div className="container reading-list-section">
      <p className="mono-label">Checked out</p>
      <h1>Your reading list.</h1>
      <p className="shelf-sub" style={{ marginBottom: "var(--space-4)" }}>
        Saved books stay right here in your browser — nothing is sent to a
        server, so this list is yours alone on this device.
      </p>

      {items.length === 0 ? (
        <div className="empty-shelf card">
          <p className="mono-label">no cards in this drawer yet</p>
          <p>Browse the shelves or search the catalog, then save anything you'd like to read.</p>
        </div>
      ) : (
        <>
          <div className="book-grid">
            {items.map((book) => (
              <BookCard
                key={book.key}
                book={book}
                saved
                stampedOn={book.savedOn}
                onOpen={onOpen}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
          <div className="reading-list-cta">
            <button className="btn btn-primary" onClick={onGoToReader}>
              Ask the Reader for picks based on this list →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
