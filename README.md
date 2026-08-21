# Shelved

A book recommendation app built for a hackathon. Browse books shelf-by-shelf
or by search, save picks to a personal reading list, and chat with an
AI "reader" for recommendations — all with **zero recurring cost** to the
team.

## Why this stays free

- **No backend, no database.** The reading list lives in the browser's
  `localStorage`. Nothing to host, nothing to pay for.
- **Book data** comes from the [Open Library API](https://openlibrary.org/developers/api),
  which is free and requires no API key.
- **AI chat is bring-your-own-key.** Each person (including judges) enters
  their own free-tier API key in Reader Settings. It's stored only in their
  browser and sent directly to the AI provider — never to us, and never
  billed to your team.
- **Hosting is GitHub Pages**, which is free for public repositories.

## Run it locally

```bash
npm install
npm run dev
```

Open the printed local URL. To try the AI chat tab, click **⚙ Reader
Settings** and paste in an API key from any OpenAI-compatible provider
(OpenAI, Groq, OpenRouter, etc. — several have free tiers).

## Deploy to GitHub Pages (free)

1. Create a new **public** GitHub repository and push this project to it:

   ```bash
   git init
   git add .
   git commit -m "Shelved: book recommendation app"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. In the repo on GitHub: **Settings → Pages → Build and deployment →
   Source → GitHub Actions**. That's it — the included workflow at
   `.github/workflows/deploy.yml` builds and deploys automatically on every
   push to `main`.

3. After the first push, check the **Actions** tab for the "Deploy to
   GitHub Pages" run. Once it's green, your app is live at:

   ```
   https://<your-username>.github.io/<your-repo>/
   ```

No further configuration needed — the workflow reads the repo name
automatically to set the correct base path.

## Project structure

```
src/
  components/     UI components (Shelf, BookCard, ReaderView, ...)
  lib/            Open Library client + bring-your-own-key AI client
  hooks/          localStorage-backed state hook
  styles/         design tokens (colors, type) + global styles
```

## Features

- Browse by genre on an interactive bookshelf, or search by title/author
- Book detail view with description, subjects, and save/remove
- Personal reading list, persisted per-device, with a "saved on" stamp
- AI reader chat, aware of your saved list, for personalized picks
- Full light/dark ("night mode") theming, respects system preference,
  toggle persists across visits
- Fully responsive, keyboard-focus visible, respects reduced-motion
