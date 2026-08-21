import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import BrowseView from "./components/BrowseView.jsx";
import ReadingList from "./components/ReadingList.jsx";
import ReaderView from "./components/ReaderView.jsx";
import BookDetail from "./components/BookDetail.jsx";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import "./App.css";

function getInitialTheme() {
  const saved = localStorage.getItem("shelved:theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function formatStamp(date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" });
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [tab, setTab] = useState("browse");
  const [readingList, setReadingList] = useLocalStorage("shelved:reading-list", []);
  const [openBook, setOpenBook] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("shelved:theme", theme);
  }, [theme]);

  const savedKeys = useMemo(() => new Set(readingList.map((b) => b.key)), [readingList]);
  const isSaved = (key) => savedKeys.has(key);

  function toggleSave(book) {
    setReadingList((prev) => {
      const exists = prev.some((b) => b.key === book.key);
      if (exists) return prev.filter((b) => b.key !== book.key);
      return [...prev, { ...book, savedOn: formatStamp(new Date()) }];
    });
  }

  return (
    <>
      <Navbar
        active={tab}
        onNavigate={setTab}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        listCount={readingList.length}
      />

      <main>
        {tab === "browse" && (
          <BrowseView isSaved={isSaved} onOpen={setOpenBook} onToggleSave={toggleSave} />
        )}
        {tab === "list" && (
          <ReadingList
            items={readingList}
            onOpen={setOpenBook}
            onToggleSave={toggleSave}
            onGoToReader={() => setTab("reader")}
          />
        )}
        {tab === "reader" && <ReaderView readingList={readingList} />}
      </main>

      <footer className="app-footer">
        <div className="container">
          <span className="mono-label">Shelved — built for a hackathon, kept free of recurring charges.</span>
        </div>
      </footer>

      {openBook && (
        <BookDetail
          book={openBook}
          saved={isSaved(openBook.key)}
          onToggleSave={(b) => { toggleSave(b); }}
          onClose={() => setOpenBook(null)}
        />
      )}
    </>
  );
}
