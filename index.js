const API_KEY = '14906382'
const url = `http://www.omdbapi.com/?apikey=${API_KEY}`
const resultContainer = document.getElementById('result')

document.getElementById('search-btn').addEventListener('click', fetchMovie)

async function fetchMovie() {
    const searchValue = document.getElementById('search-input').value

    if (!searchValue) return

    const res = await fetch(`${url}&s=${encodeURIComponent(searchValue)}`)
    const data = await res.json()

    data.Search.forEach((movie, index) => {
        resultContainer.innerHTML += `
            <div class="go-to-movie" data-index="${index}" id="${movie.imdbID}">
                <img src=${movie.Poster}>
                <p>${movie.Title}</p>
                <p>${movie.Year}</p>
            </div>
        `
    }); 
}

resultContainer.addEventListener('click', (e) => {
    const goToMovie = e.target.closest('.go-to-movie')

    showMovieDetail(goToMovie.id)
})

async function showMovieDetail(imdbID) {
    const res = await fetch(`${url}&i=${imdbID}`)
    const data = await res.json()
    console.log(data)

    const chosenMovie = document.createElement('div')
    chosenMovie.className = 'chosen-movie'
    chosenMovie.innerHTML = `
        <img src="${data.Poster}">
        <p>${data.Title}</p>
        <div>
            <span>${data.Year}</span>
            <span>${data.Runtime}</span>
            <p>Directed by: ${data.Director}</p>
        </div>
        <p>${data.Plot}</p>
        <p>${data.Genre}</p>
        <p>${data.Actors}</p>
    `
    document.body.appendChild(chosenMovie)
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