# Deploy to the existing virajmhatre.com GitHub + Vercel project

**Repository:** https://github.com/virajmhatre415/virajmhatre.com  
**Branch:** `main`  
**Domain:** `virajmhatre.com`

Your existing repository (as checked 2026-11-06) contains a static `index.html`, a
`vercel.json` with legacy `/api/etl/*` rewrites, and a `CNAME` file. This
starter **replaces** that static root with a Next.js 14 App Router project.
Do not copy the old `index.html`, `vercel.json`, or `CNAME` into the new root.

## Safest update

1. Download and extract `viraj-portfolio-for-virajmhatre.com.zip`.
2. In your GitHub repository, create a backup branch from `main` called
   `backup/static-portfolio` (GitHub **Branches > New branch**).
3. Clone your existing repo locally:
   ```bash
   git clone https://github.com/virajmhatre415/virajmhatre.com.git
   cd virajmhatre.com
   ```
4. Remove the previous static site's root files (keep `.git/`); copy the
   **contents** of the extracted `viraj-portfolio/` folder to the repo root.
5. Install and verify locally:
   ```bash
   npm install
   npm run build
   npm run dev
   ```
6. Push the replacement:
   ```bash
   git add -A
   git commit -m "Build cinematic Next.js portfolio"
   git push origin main
   ```
7. In **Vercel > your existing project > Settings > Build and Deployment**, check:
   - Framework Preset: **Next.js**
   - Root Directory: **./** (repository root)
   - Output Directory: **not overridden**
   - Build Command: default (`next build`)
   - Install Command: default (`npm install`)
   Vercel should redeploy from the `main` push. If framework settings are
   locked to the old static preset, update them and redeploy.
8. In **Vercel > Settings > Domains**, confirm `virajmhatre.com` still points
   to this project. **Do not modify DNS** if the domain already works.

## Real animation frames

Put the WebP sequence in `public/frames/`:
`frame_00_delay-0.067s.webp` ... `frame_89_delay-0.067s.webp`.

Until you add those frames, the canvas animates the supplied portrait with a
subtle zoom/pan. A single photograph cannot provide authentic alternate views.

## Additional housekeeping

- Set your GitHub repo's **About > Website** link to `https://virajmhatre.com`;
  the checked repository currently points to an unrelated `ragforge-ai-rouge.vercel.app` URL.
- The 4 case-study cards describe your resume-supported work, not fabricated
  independent commercial products or unverified performance metrics.
- Nothing in this archive has been committed, pushed, or deployed on your behalf.
