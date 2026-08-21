import { useEffect, useState } from "react";
import { coverUrl, getWorkDetails } from "../lib/openLibrary.js";
import "./BookDetail.css";

export default function BookDetail({ book, saved, onClose, onToggleSave }) {
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setDescription("");
    getWorkDetails(book.key)
      .then((d) => {
        if (cancelled) return;
        setDescription(d.description);
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => { cancelled = true; };
  }, [book.key]);

  return (
    <div className="detail-overlay" role="dialog" aria-modal="true" aria-label={book.title} onClick={onClose}>
      <div className="detail-card" onClick={(e) => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="detail-grid">
          <div className="detail-cover">
            {coverUrl(book.cover_i, "L") ? (
              <img src={coverUrl(book.cover_i, "L")} alt="" />
            ) : (
              <div className="detail-cover-placeholder">{book.title}</div>
            )}
          </div>

          <div className="detail-info">
            <p className="mono-label">
              {book.first_publish_year ? `first published ${book.first_publish_year}` : "publication year unknown"}
            </p>
            <h2>{book.title}</h2>
            <p className="detail-author">{book.author_name?.join(", ") || "Unknown author"}</p>

            {book.subject?.length > 0 && (
              <div className="detail-tags">
                {book.subject.map((s) => (
                  <span key={s} className="detail-tag mono-label">{s}</span>
                ))}
              </div>
            )}

            <div className="detail-description">
              {status === "loading" && <p className="mono-label">fetching description…</p>}
              {status === "error" && <p className="mono-label">No description on file for this edition.</p>}
              {status === "ready" && (description
                ? <p>{description}</p>
                : <p className="mono-label">No description on file for this edition.</p>
              )}
            </div>

            <div className="detail-actions">
              <button className="btn btn-primary detail-save" onClick={() => onToggleSave(book)}>
                {saved ? "Remove from reading list" : "Save to reading list"}
              </button>
              
                className="btn"
                href={`https://openlibrary.org${book.key}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read or borrow on Open Library (opens in new tab)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
