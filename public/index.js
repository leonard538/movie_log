const resultContainer = document.getElementById('result')
const watchlistContainer = document.getElementById('watchlist-container')
const searchContainer = document.querySelector('.search-container')
const watchlistToggle = document.getElementById('watchlist-toggle')
let watchlistArr = []
let isWatchlistMode = false

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle')
const html = document.documentElement

// Load saved theme or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark'
html.setAttribute('data-theme', savedTheme)

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme')
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    html.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
})

// Watchlist toggle functionality
watchlistToggle.addEventListener('click', () => {
    isWatchlistMode = !isWatchlistMode
    toggleWatchlistMode()
})

function toggleWatchlistMode() {
    if (isWatchlistMode) {
        // Switch to watchlist mode
        watchlistToggle.textContent = 'Search for movies'
        searchContainer.style.display = 'none'
        resultContainer.style.display = 'none'
        watchlistContainer.style.display = 'flex'
        renderWatchlist()
    } else {
        // Switch to search mode
        watchlistToggle.textContent = 'My Watchlist'
        searchContainer.style.display = 'flex'
        resultContainer.style.display = ''
        watchlistContainer.style.display = 'none'
    }
}

document.getElementById('search-btn').addEventListener('click', fetchMovie)
document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchMovie()
})

async function fetchMovie() {
    const searchValue = document.getElementById('search-input').value

    if (!searchValue) return

    // Show loading state
    resultContainer.innerHTML = '<div class="loading"></div>'

    try {
        const res = await fetch(`/api/search?s=${encodeURIComponent(searchValue)}`)
        const data = await res.json()

        if (data.Response === 'False') {
            resultContainer.innerHTML = `
                <div class="no-results">
                    <h3>No movies found</h3>
                    <p>Try searching for something else</p>
                </div>
            `
            return
        }

        resultContainer.innerHTML = ''
        data.Search.forEach((movie) => {
            const posterSrc = movie.Poster !== 'N/A'
                ? movie.Poster 
                : './img/poster_na.png'
            
            resultContainer.innerHTML += `
                <div class="go-to-movie" data-id="${movie.imdbID}">
                    <img src="${posterSrc}" alt="${movie.Title}">
                    <div class="movie-info">
                        <p class="movie-title">${movie.Title}</p>
                        <p class="movie-year">${movie.Year}</p>
                    </div>
                    <button class="add-watchlist"><i class="fa-solid fa-circle-plus"></i> Watchlist</button>
                </div>
            `
        })
    } catch (error) {
        resultContainer.innerHTML = `
            <div class="no-results">
                <h3>Something went wrong</h3>
                <p>Please try again later</p>
            </div>
        `
    }
}

// Add to watchlist or View more info
resultContainer.addEventListener('click', async (e) => {
    const parent = e.target.closest('.go-to-movie')
    if (!parent) return

    if(e.target.classList.contains('add-watchlist')) {
        console.log(parent)
        
        try {
            const res = await fetch(`api/movie?i=${parent.dataset.id}`)
            const data = await res.json()
            
            watchlistArr.unshift({ Poster: data.Poster,
                    Title: data.Title,
                    Year: data.Year,
                    Runtime: data.Runtime,
                    Rated: data.Rated,
                    Director: data.Director,
                    Plot: data.Plot,
                    Genre: data.Genre,
                    Actors: data.Actors,
                    imbdRating: data.imdbRating,
                    imdbID: data.imdbID
                })
        } catch (error) {
            console.error('Error fetching movie details:', error)
        }

    } else {
        showMovieDetail(parent.dataset.id)
    }
    
})

watchlistContainer.addEventListener('click', (e) => {
    const parent = e.target.closest('.watch-card')
    if(!parent) return 

    // Handle remove from watchlist
    if(e.target.closest('.remove-watchlist')) {
        const movieId = parent.dataset.id
        watchlistArr = watchlistArr.filter(movie => movie.imdbID !== movieId)
        renderWatchlist()
        return
    }

    showMovieDetail(parent.dataset.id)
})

function renderWatchlist() {
    if (watchlistArr.length === 0) {
        watchlistContainer.innerHTML = `
            <div class="empty-watchlist">
                <i class="fa-solid fa-bookmark"></i>
                <h3>Your watchlist is empty</h3>
                <p>Search for movies and add them to your watchlist</p>
            </div>
        `
        return
    }

    watchlistContainer.innerHTML = ''
    watchlistArr.forEach((movie) => {
        const posterSrc = movie.Poster !== 'N/A' ? movie.Poster : './img/poster_na.png'
        watchlistContainer.innerHTML += `
            <div class="watch-card" data-id="${movie.imdbID}">
                <img src="${posterSrc}" alt="${movie.Title}">
                <div class="watch-card-details">
                    <div class="watch-card-header">
                        <h3 class="movie-title">${movie.Title}</h3>
                        <span class="movie-rating">⭐ ${movie.imbdRating || 'N/A'}</span>
                    </div>
                    <div class="watch-card-meta">
                        <span class="movie-runtime">${movie.Runtime || 'N/A'}</span>
                        <span class="movie-genre">${movie.Genre || 'N/A'}</span>
                        <button class="remove-watchlist"><i class="fa-solid fa-circle-minus"></i> Remove</button>
                    </div>
                    <p class="movie-plot">${movie.Plot || 'No plot available.'}</p>
                </div>
            </div>
        `
    })
}

async function showMovieDetail(imdbID) {
    try {
        const res = await fetch(`api/movie?i=${imdbID}`)
        const data = await res.json()

        // Remove existing modal if any
        const existingModal = document.querySelector('.modal-overlay')
        if (existingModal) existingModal.remove()

        const posterSrc = data.Poster !== 'N/A' 
            ? data.Poster 
            : './img/poster_na.png'

        const genres = data.Genre.split(', ').map(g => `<span>${g}</span>`).join('')

        const modalOverlay = document.createElement('div')
        modalOverlay.className = 'modal-overlay'
        modalOverlay.innerHTML = `
            <div class="chosen-movie">
                <button class="close-btn">&times;</button>
                <img class="movie-poster" src="${posterSrc}" alt="${data.Title}">
                <div class="movie-details">
                    <h2 class="movie-title">${data.Title}</h2>
                    <div class="movie-meta">
                        <span>${data.Year}</span>
                        <span>${data.Runtime}</span>
                        <span>${data.Rated}</span>
                    </div>
                    <p class="movie-director"><strong>Director:</strong> ${data.Director}</p>
                    <p class="movie-plot">${data.Plot}</p>
                    <div class="movie-genre">${genres}</div>
                    <p class="movie-cast"><strong>Cast:</strong> ${data.Actors}</p>
                    <div class="movie-rating">
                        <span class="rating-badge">⭐ ${data.imdbRating}</span>
                    </div>
                </div>
            </div>
        `

        document.body.appendChild(modalOverlay)

        // Close modal on overlay click or close button
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay || e.target.classList.contains('close-btn')) {
                modalOverlay.remove()
            }
        })

        // Close on escape key
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                modalOverlay.remove()
                document.removeEventListener('keydown', closeOnEscape)
            }
        })
    } catch (error) {
        console.error('Error fetching movie details:', error)
    }
}


// Actors:"Christian Bale, Michael Caine, Ken Watanabe"
// Awards:"Nominated for 1 Oscar. 15 wins & 79 nominations total"
// BoxOffice:"$206,863,479"
// Country:"United States, United Kingdom"
// DVD:"N/A"
// Director:"Christopher Nolan"
// Genre:"Action, Crime, Drama"
// Language:"English, Mandarin"
// Metascore:"70"
// Plot:"After witnessing his parents' death, billionaire Bruce Wayne learns the art of fighting to confront injustice. When he returns to Gotham as Batman, he must stop a secret society that intends to destroy the city."
// Poster:"https://m.media-amazon.com/images/M/MV5BMzA2NDQzZDEtNDU5Ni00YTlkLTg2OWEtYmQwM2Y1YTBjMjFjXkEyXkFqcGc@._V1_SX300.jpg"
// Production:"N/A"
// Rated:"PG-13"
// Ratings:[
//     {Source: 'Internet Movie Database', Value: '8.2/10'},
//     {Source: 'Rotten Tomatoes', Value: '85%'},
//     {Source: 'Metacritic', Value: '70/100'}
// ]
// Released:"15 Jun 2005"
// Response:"True"
// Runtime:"140 min"
// Title:"Batman Begins"
// Type:"movie"
// Website:"N/A"
// Writer:"Bob Kane, David S. Goyer, Christopher Nolan"
// Year:"2005"
// imdbID: "tt0372784"
// imdbRating: "8.2"
// imdbVotes: "1,688,565"