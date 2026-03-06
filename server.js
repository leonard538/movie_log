import http from "node:http"
import dotenv from "dotenv"
import url from "url"
import fs from "fs"

dotenv.config()

const PORT = 8000
const API_KEY = process.env.API_KEY
const BASE_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`

const server = http.createServer( async (req, res) => {
    
    const parseUrl = url.parse(req.url, true)
    console.log(parseUrl)
    const pathname = parseUrl.pathname
    const query = parseUrl.query

    // default
    if (pathname === "/") {
        const defaultHtml = fs.readFileSync("./public/index.html")

        res.writeHead(200, {"Content-type": "text/html"})
        res.end(defaultHtml)
        return
    }

    // For search movie
    if (pathname === "api/search") {
        const searchValue = query.s

        const response = await fetch(`${BASE_URL}&s=${encodeURIComponent(searchValue)}`)
        const data = await response.json()

        res.writeHead(200, 'application/json')
        res.end(JSON.stringify(data))
        return
    }

    // For movie detail 
    if (pathname === "api/movie") {
        const movieId = query.id

        const response = await fetch(`${BASE_URL}&i=${movieId}`)
        const data = await response.json()

        res.writeHead(200, 'application/json')
        res.end(JSON.stringify(data))
        return
    }

    res.writeHead(404)
    res.end('Not Found')
})

server.listen(PORT, () => console.log(`http://localhost:${PORT}`))