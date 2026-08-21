// Thin client for the Open Library API — free, keyless, no rate-limit
// surprises. https://openlibrary.org/developers/api

const BASE = "https://openlibrary.org";
const COVERS = "https://covers.openlibrary.org/b";

export function coverUrl(coverId, size = "M") {
  if (!coverId) return null;
  return `${COVERS}/id/${coverId}-${size}.jpg`;
}

export async function searchBooks(query, limit = 20) {
  if (!query?.trim()) return [];
  const url = `${BASE}/search.json?q=${encodeURIComponent(
    query
  )}&limit=${limit}&fields=key,title,author_name,first_publish_year,cover_i,subject,ratings_average,edition_count`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search failed (${res.status})`);
  const data = await res.json();
  return (data.docs || []).map(normalizeDoc);
}

export async function getSubjectBooks(subject, limit = 18) {
  const url = `${BASE}/subjects/${encodeURIComponent(
    subject
  )}.json?limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Subject fetch failed (${res.status})`);
  const data = await res.json();
  return (data.works || []).map((w) => ({
    key: w.key,
    title: w.title,
    author_name: (w.authors || []).map((a) => a.name),
    first_publish_year: w.first_publish_year,
    cover_i: w.cover_id,
    subject: w.subject?.slice(0, 4) || [],
    ratings_average: null,
    edition_count: w.edition_count,
  }));
}

export async function getWorkDetails(workKey) {
  const url = `${BASE}${workKey}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Work fetch failed (${res.status})`);
  const data = await res.json();
  const description =
    typeof data.description === "string"
      ? data.description
      : data.description?.value || "";
  return { description, subjects: data.subjects || [] };
}

function normalizeDoc(doc) {
  return {
    key: doc.key,
    title: doc.title,
    author_name: doc.author_name || [],
    first_publish_year: doc.first_publish_year,
    cover_i: doc.cover_i,
    subject: (doc.subject || []).slice(0, 4),
    ratings_average: doc.ratings_average,
    edition_count: doc.edition_count,
  };
}
