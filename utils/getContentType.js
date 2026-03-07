export default function getContentType(extentionName) {

    const type = {
        ".js": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpg",
        ".jepg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg"
    }

    return type[extentionName.toLowerCase()] || "text/html"
}