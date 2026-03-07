import http from "node:http"
import dotenv from "dotenv"
import url from "url"
import fs from "fs"
import path from "node:path"
import getContentType from "./utils/getContentType.js"

dotenv.config()

const PORT = 8000
const API_KEY = process.env.API_KEY
const BASE_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`

const server = http.createServer( async (req, res) => {

    // Set cors
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")    
    
    if (req.method === "OPTIONS") {
        res.writeHead(204)
        res.end()
        return
    }

    const parseUrl = url.parse(req.url, true)
    const pathname = parseUrl.pathname
    const query = parseUrl.query
    const contentType = getContentType(path.extname(pathname))

    // default
    if (pathname === "/") {
        const defaultHtml = fs.readFileSync("./public/index.html")

        res.writeHead(200, {'Content-Type': contentType })
        res.end(defaultHtml)
        return
    }

    const filePath = `./public${pathname}`
    if (fs.existsSync(filePath)) {
        const file = fs.readFileSync(filePath)
        res.statusCode = 200
        res.setHeader('Content-Type', contentType)
        res.end(file)
        return
    }    

    // For search movie
    if (pathname === "/api/search") {
        const searchValue = query.s

        const response = await fetch(`${BASE_URL}&s=${encodeURIComponent(searchValue)}`)
        const data = await response.json()

        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(data))
        return
    }

    // For movie detail 
    if (pathname === "/api/movie") {
        const movieId = query.i

        const response = await fetch(`${BASE_URL}&i=${movieId}`)
        const data = await response.json()

        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(data))
        return
    }

    res.writeHead(404)
    res.end('Not Found')
})

server.listen(PORT, () => console.log(`http://localhost:${PORT}`))