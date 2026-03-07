# Movie Watchlist

A sleek movie search and watchlist application that lets you discover, explore, and save your favorite films.  
[deployed app is not available yet]

## Features

- **Movie Search** - Search for movies using the OMDB API
- **Watchlist** - Save movies to your personal watchlist for later viewing
- **Movie Details** - View detailed information including rating, runtime, director, cast, and plot
- **Dark/Light Theme** - Toggle between dark and light modes with theme persistence
- **Responsive Design** - Works seamlessly across desktop and mobile devices

## Tech Stack

- **Node.js** - Backend HTTP server with API proxy
- **HTML5** - Semantic markup structure
- **CSS3** - Custom properties (CSS variables), Flexbox, responsive design
- **JavaScript (ES6+)** - Async/await, modules, DOM manipulation, Local Storage
- **OMDB API** - Movie data and poster images
- **Font Awesome** - Icons
- **dotenv** - Environment variable management

## How to Use

1. Enter a movie title in the search bar
2. Click "Search" or press Enter
3. Browse through the search results
4. Click on a movie card to view more details
5. Click the "Watchlist" button to save a movie
6. Access your saved movies by clicking "My Watchlist"

## Project Structure

```
movie_watchlist/
├── server.js           # Node.js HTTP server with API routes
├── package.json        # Project dependencies and scripts
├── .env                # Environment variables (API_KEY)
├── README.md           # Project documentation
├── public/
│   ├── index.html      # Main HTML file
│   ├── index.js        # Frontend JavaScript logic
│   ├── styles.css      # Styling
│   └── img/            # Images (banner, placeholder poster)
└── utils/
    └── getContentType.js   # MIME type utility
```

## API Endpoints

- `GET /api/search?s={query}` - Search for movies by title
- `GET /api/movie?i={imdbID}` - Get detailed movie information by IMDB ID

## Getting Started

1. Clone or download the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your OMDB API key:
   ```
   API_KEY=your_omdb_api_key
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open `http://localhost:8000` in your browser

---

This is a challenge project from [Scrimba](https://scrimba.com/?via=u42c5f8e) - an interactive learning platform for developers.
