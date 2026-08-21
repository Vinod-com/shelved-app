import { useState } from "react";
import { DEFAULT_BASE_URL, DEFAULT_MODEL } from "../lib/aiClient.js";
import "./ReaderSettings.css";

export default function ReaderSettings({ settings, onSave, onClear, onClose }) {
  const [apiKey, setApiKey] = useState(settings.apiKey || "");
  const [baseUrl, setBaseUrl] = useState(settings.baseUrl || DEFAULT_BASE_URL);
  const [model, setModel] = useState(settings.model || DEFAULT_MODEL);
  const [showAdvanced, setShowAdvanced] = useState(false);

  function submit(e) {
    e.preventDefault();
    onSave({ apiKey: apiKey.trim(), baseUrl: baseUrl.trim() || DEFAULT_BASE_URL, model: model.trim() || DEFAULT_MODEL });
    onClose();
  }

  return (
    <div className="detail-overlay" role="dialog" aria-modal="true" aria-label="Reader settings" onClick={onClose}>
      <div className="settings-card" onClick={(e) => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose} aria-label="Close">✕</button>
        <p className="mono-label">reader settings</p>
        <h2>Bring your own key.</h2>
        <p className="settings-copy">
          Your key is saved only in this browser's local storage and is sent
          directly to your chosen provider — never to us, and never billed to
          the hackathon team. Clear it any time.
        </p>

        <form onSubmit={submit} className="settings-form">
          <label className="mono-label" htmlFor="api-key">API key</label>
          <input
            id="api-key"
            type="password"
            autoComplete="off"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-…"
          />

          <button type="button" className="btn btn-ghost settings-advanced-toggle" onClick={() => setShowAdvanced((v) => !v)}>
            {showAdvanced ? "Hide" : "Show"} advanced (change provider / model)
          </button>

          {showAdvanced && (
            <div className="settings-advanced">
              <label className="mono-label" htmlFor="base-url">API base URL</label>
              <input id="base-url" type="text" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
              <p className="settings-hint">
                Any OpenAI-compatible endpoint works — e.g. Groq or OpenRouter,
                several of which have free tiers if you'd rather not use a paid
                OpenAI key.
              </p>

              <label className="mono-label" htmlFor="model">Model</label>
              <input id="model" type="text" value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
          )}

          <div className="settings-actions">
            <button type="button" className="btn" onClick={() => { onClear(); onClose(); }}>
              Clear saved key
            </button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
