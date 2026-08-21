import { useEffect, useRef, useState } from "react";
import { chatComplete, loadAISettings, saveAISettings, clearAISettings } from "../lib/aiClient.js";
import ReaderSettings from "./ReaderSettings.jsx";
import "./ReaderView.css";

const STARTERS = [
  "Recommend something like the books on my reading list.",
  "I want a short, atmospheric novel for a rainy weekend.",
  "Surprise me with a book outside my usual genres.",
];

export default function ReaderView({ readingList }) {
  const [settings, setSettings] = useState(loadAISettings());
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "I'm the Reader. Tell me a mood, a genre, or a book you loved, and I'll suggest what to pick up next. I can also see the titles on your reading list if you'd like picks based on those.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text) {
    const content = text.trim();
    if (!content || busy) return;
    setError("");
    setInput("");

    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setBusy(true);

    try {
      const listContext = readingList.length
        ? `The reader's saved list currently has: ${readingList.map((b) => `"${b.title}"${b.author_name?.[0] ? ` by ${b.author_name[0]}` : ""}`).join(", ")}.`
        : "The reader's saved list is currently empty.";

      const systemPrompt = {
        role: "system",
        content:
          "You are a warm, well-read librarian inside a book-recommendation app called Shelved. " +
          "Recommend real, published books. For each recommendation give the title, author, one " +
          "sentence on why it fits, in a short list. Keep replies under 150 words unless asked for more. " +
          listContext,
      };

      const reply = await chatComplete([systemPrompt, ...nextMessages]);
      setMessages((prev) => [...prev, { role: "assistant", content: reply || "…" }]);
    } catch (err) {
      setError(err.message || "Something went wrong talking to the AI provider.");
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    send(input);
  }

  return (
    <div className="container reader-section">
      <div className="reader-header">
        <div>
          <p className="mono-label">Ask a reader</p>
          <h1>A librarian, on call.</h1>
        </div>
        <button className="btn" onClick={() => setShowSettings(true)}>
          ⚙ Reader Settings
        </button>
      </div>

      {!settings.apiKey && (
        <div className="card reader-key-notice">
          <p>
            <strong>Add your own API key</strong> to start chatting — it's free
            to set up and nothing here is billed to us. Your key stays only in
            this browser.
          </p>
          <button className="btn btn-primary" onClick={() => setShowSettings(true)}>
            Add API key
          </button>
        </div>
      )}

      <div className="reader-chat card">
        <div className="reader-messages" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`reader-msg reader-msg-${m.role}`}>
              <span className="mono-label reader-msg-role">{m.role === "user" ? "you" : "reader"}</span>
              <p>{m.content}</p>
            </div>
          ))}
          {busy && (
            <div className="reader-msg reader-msg-assistant">
              <span className="mono-label reader-msg-role">reader</span>
              <p className="reader-typing">thinking…</p>
            </div>
          )}
        </div>

        {messages.length === 1 && (
          <div className="reader-starters">
            {STARTERS.map((s) => (
              <button key={s} className="btn btn-ghost" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        {error && <p className="reader-error mono-label">{error}</p>}

        <form className="reader-input-row" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={settings.apiKey ? "Ask for a recommendation…" : "Add an API key to start chatting…"}
            disabled={!settings.apiKey || busy}
          />
          <button type="submit" className="btn btn-primary" disabled={!settings.apiKey || busy}>
            Send
          </button>
        </form>
      </div>

      {showSettings && (
        <ReaderSettings
          settings={settings}
          onSave={(s) => { saveAISettings(s); setSettings(s); }}
          onClear={() => { clearAISettings(); setSettings({ apiKey: "", baseUrl: settings.baseUrl, model: settings.model }); }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
