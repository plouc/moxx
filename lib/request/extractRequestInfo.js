const parseUrl  = require('url').parse


module.exports = req => {
    const { headers, method, url } = req
    const { query }                = parseUrl(url, true)

    const info = {
        method,
        url,
        query,
        headers,
    }

    return info
}