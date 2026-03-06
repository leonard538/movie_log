import http from "node:http"
import dotenv from "dotenv"
import url from "url"

dotenv.config()

const PORT = 8000
const API_KEY = process.env.API_KEY
const BASE_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`

const server = http.createServer( async (req, res) => {
    
    const parseUrl = url.parse(req.url, true)
    console.log(parseUrl)
    const pathname = parseUrl.pathname
    const query = parseUrl.query

    

})

server.listen(PORT, () => console.log(`Connected on port : ${PORT}`))