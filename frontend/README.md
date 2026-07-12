# FruitBasket Frontend

React SPA for the FruitBasket multi-farm marketplace.

<p align="center">
  <img src="../docs/screenshots/05-homepage-hero.png" alt="Homepage hero" width="800" />
</p>

## Screenshots

| Standalone auth | Journal + testimonials |
|:---:|:---:|
| ![Register](../docs/screenshots/04-register-auth.png) | ![Journal](../docs/screenshots/02-journal-testimonials.png) |

| Storytelling sections | Mobile marketplace |
|:---:|:---:|
| ![Story](../docs/screenshots/01-homepage-story.png) | ![Mobile](../docs/screenshots/06-marketplace-mobile.png) |

More images live in [`../docs/screenshots/`](../docs/screenshots/).

---

## Stack

- **React 19** + **Vite 7**
- **Tailwind CSS 4** (`@tailwindcss/vite`)
- **React Router 7**
- **Lucide React** icons
- Fonts: DM Sans + Fraunces (display)

API calls go through `src/api.js` → `VITE_API_URL` (default `http://localhost:5000`).

---

## Run locally

Prerequisites: Node 18+, backend running on port 5000.

```bash
cd frontend
npm install
cp .env.example .env   # optional
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

### Env

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
```

---

## App structure

```
src/
├── api.js                 # fetch helper + timeout
├── App.jsx                # routes (auth pages outside Layout)
├── context/               # AuthContext, CartContext
├── components/
│   ├── auth/              # AuthShell, GoogleSignIn, OTP, PasswordInput, RequireAuth
│   ├── home/              # Homepage sections
│   ├── layout/            # Navbar, Footer, UniversalSearch
│   └── shared/            # ProductCard, FarmerCard, RichText
└── pages/                 # Home, Marketplace, Login, Register, FarmerDashboard, Admin, …
```

### Notable routes

| Path | Notes |
|------|--------|
| `/` | Full homepage storytelling |
| `/login`, `/register` | Standalone (no navbar/footer) |
| `/marketplace` | Catalog + mobile filter sheet |
| `/farmer/*` | Farmer dashboard (pending farmers allowed; badge + banner) |
| `/admin` | Farms, flags, reviews, returns, CMS |
| `/orders` | Farm-grouped orders, review + return |

---

## UI conventions

- Brand greens / soil tones (`#1f6b3a`, `#3d2f24`, `#f7f3eb`)
- `.tap-target` — min 44×44px hit areas for mobile
- `.font-display` — Fraunces for story headlines
- Prefer live API data for Fresh this week, Journal, Testimonials, Impact

---

## Related

See the [root README](../README.md) for backend setup, seed accounts, schema, and Google OAuth.
