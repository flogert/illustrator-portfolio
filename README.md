# Illustrator / Game Artist Portfolio

A cozy, animated portfolio site for showcasing game art, illustrations, characters, environments, and UI/UX work.

## Tech

- Vite
- Tailwind CSS
- Three.js (subtle interactive effects)

## Local development

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal (usually `http://localhost:5173`).

## Build & preview

```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages)

This repo includes a GitHub Actions workflow that builds the site and deploys the `dist/` output to GitHub Pages on pushes to `main`.

## Customize content

- Main page content: `index.html`
- Styles: `src/index.css`
- JS / effects: `src/main.js`

Common quick edits:
- Update email: search for `mailto:` in `index.html`
- Update social links: search for `social-link` in `index.html`
- Replace gallery images: update the `<img src="...">` URLs in the Gallery section
