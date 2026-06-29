# 🌿 CropHealth AI — AI Crop Disease Diagnosis

AI-powered crop disease, pest, and nutritional deficiency diagnosis for Indian farmers. Built with React + Vite + Claude Vision AI.

## Features
- 📸 Smartphone photo analysis for diseases, pests, deficiencies
- 🌱 Organic-first treatment recommendations
- 💰 Budget-aware advice in ₹ per acre
- 🗺️ India-specific — 28 states, ICAR guidelines, local product names
- 📋 Diagnosis history saved on device
- 💬 Follow-up Q&A with the AI

## Quick start

### 1. Install dependencies
```bash
npm install
```

### 2. Add your gemini API key
Open `.env` and replace `your_api_key_here`:
```
VITE_gemini_API_KEY=sk-ant-xxxxxxxxxx
```
Get your key at https://console.gemini.com

### 3. Run the dev server
```bash
npm run dev
```
Opens at http://localhost:3000

### 4. Build for production
```bash
npm run build
npm run preview   # preview production build locally
```

## Project structure
```
CropHealth AI/
├── src/
│   ├── components/       # Navbar, Footer
│   ├── pages/            # Home, Diagnose, Tips, History, About
│   ├── services/
│   │   ├── gemini.js  # All Claude API calls
│   │   └── history.js    # Local storage for history
│   ├── styles/
│   │   └── globals.css   # Design system tokens + base styles
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.js
├── package.json
└── .env                  # Your API key (never commit this)
```

## Deploying
- **Vercel**: `npx vercel` — add `VITE_gemini_API_KEY` in Vercel dashboard → Settings → Environment Variables
- **Netlify**: drag `dist/` folder after `npm run build` — add env var in Netlify dashboard
- **GitHub Pages**: use `vite-plugin-gh-pages` or GitHub Actions

## Notes
- The API key is used directly from the browser (client-side). For production, proxy API calls through a backend (Node/Express/Next.js API route) to keep the key secure.
- Diagnosis history is stored in `localStorage` — device-only, no server.
