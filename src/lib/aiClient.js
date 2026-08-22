// Bring-your-own-key AI client. The key never leaves the user's browser
// except to talk directly to the provider's API — it is not sent to any
// server we run, and nothing here is billed to the hackathon team.
//
// Defaults to OpenAI's endpoint, but any OpenAI-compatible endpoint works
// (e.g. Groq, OpenRouter, a local Ollama server) by changing the base URL —
// several of those have generous free tiers, so testers aren't required
// to have a paid OpenAI account.

const DEFAULT_BASE_URL = "https://api.groq.com/openai/v1";
const DEFAULT_MODEL = "openai/gpt-oss-20b;

export function loadAISettings() {
  try {
    const raw = localStorage.getItem("shelved:ai-settings");
    if (!raw) return { apiKey: "", baseUrl: DEFAULT_BASE_URL, model: DEFAULT_MODEL };
    return { baseUrl: DEFAULT_BASE_URL, model: DEFAULT_MODEL, ...JSON.parse(raw) };
  } catch {
    return { apiKey: "", baseUrl: DEFAULT_BASE_URL, model: DEFAULT_MODEL };
  }
}

export function saveAISettings(settings) {
  localStorage.setItem("shelved:ai-settings", JSON.stringify(settings));
}

export function clearAISettings() {
  localStorage.removeItem("shelved:ai-settings");
}

export async function chatComplete(messages, settingsOverride) {
  const settings = settingsOverride || loadAISettings();
  const { apiKey, baseUrl, model } = settings;
  if (!apiKey) {
    throw new Error("No API key set. Add one in Reader Settings first.");
  }

  const res = await fetch(`${baseUrl.replace(/\/+$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || DEFAULT_MODEL,
      messages,
      temperature: 0.8,
      max_tokens: 500,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`AI request failed (${res.status}). ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

export { DEFAULT_BASE_URL, DEFAULT_MODEL };
