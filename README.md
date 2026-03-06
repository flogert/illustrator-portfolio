# Flogert Portfolio

A minimal, Swiss-style portfolio site for showcasing game art, illustrations, characters, environments, and UI/UX work designed for Flogert.

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

## Connect to GitHub Pages

Push to your repository and enable GitHub Pages in Settings > Pages (Source: GitHub Actions).

## Customize content

- Main page content: `index.html`
- Styles: `src/index.css`
- JS / effects: `src/main.js`

Common quick edits:
- Update email: search for `mailto:` in `index.html`
- Update social links: search for `social-link` in `index.html`
- Replace gallery images: update the `<img src="...">` URLs in the Gallery section
