# Viraj Mhatre — Cinematic Data Engineering Portfolio

Dark, responsive personal portfolio built with Next.js 14 (App Router), TypeScript,
Tailwind CSS, Framer Motion, and HTML5 Canvas. Designed around your supplied
portrait and resume: PL/SQL, Oracle ODI, ETL, and database engineering.

## Local development

```bash
npm install
npm run dev
```

Production validation: `npm run build`.

## Scroll animation

The sticky cinematic section is 500vh tall. Scroll position selects a frame on
an HTML5 canvas, while overlay headlines animate independently. When supplied,
90 WebP files are preloaded in batches to minimize flicker. The static portrait
serves as an instant fallback and gets a subtle camera move if no sequence exists.

Frame names, placed in `public/frames/`:
`frame_00_delay-0.067s.webp` through `frame_89_delay-0.067s.webp`.

One still image cannot reliably create true alternate camera angles.

## Deploying to your existing website

See [`DEPLOY_TO_EXISTING_REPO.md`](./DEPLOY_TO_EXISTING_REPO.md).

The project is ready to *upload* to your GitHub repository; it has not been
published or connected to Vercel by this package.
