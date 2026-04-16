# Movie Watchlist

Movie search and watchlist app split into frontend and backend folders so each can be deployed to different platforms.

## Features

- Search movies from OMDB
- Save movies to a local watchlist
- View detailed movie info in a modal
- Dark and light theme toggle with persistence
- Responsive UI

## Production-Ready Structure

```
movie_watchlist/
├── backend/
│   ├── package.json
│   ├── .env.example
│   └── server.js
├── frontend/
│   └── public/
│       ├── config.js
│       ├── index.html
│       ├── index.js
│       ├── styles.css
│       └── img/
├── package.json
└── README.md
```

## Backend Setup (Deploy Separately)

Backend is an API service only.

1. Go to `backend`.
2. Install dependencies:

```bash
npm install
```

3. Create `.env` from `.env.example` and set:

```env
API_KEY=your_omdb_api_key
PORT=8000
FRONTEND_ORIGIN=https://your-frontend-domain.com
```

`FRONTEND_ORIGIN` can be `*` for open CORS or a comma-separated list of allowed frontend origins.

4. Run locally:

```bash
npm run dev
```

or production start:

```bash
npm start
```

### Backend Endpoints

- `GET /health`
- `GET /api/search?s={query}`
- `GET /api/movie?i={imdbID}`

## Frontend Setup (Deploy Separately)

Frontend is a static app in `frontend/public`.

Set your deployed backend URL in `frontend/public/config.js`:

```js
window.APP_CONFIG = {
  API_BASE_URL: "https://your-backend-domain.com"
};
```

If `API_BASE_URL` is empty, the app uses same-origin requests.

## Root Helper Scripts

From repository root:

```bash
npm run install:backend
npm run dev:backend
npm run start:backend
```

## Deployment Notes

- Deploy `backend` to a Node.js host (Render, Railway, Fly.io, etc.)
- Deploy `frontend/public` to a static host (Netlify, Vercel static, Cloudflare Pages, etc.)
- Update `frontend/public/config.js` with the deployed backend URL
- Set backend `FRONTEND_ORIGIN` to the deployed frontend domain(s)
