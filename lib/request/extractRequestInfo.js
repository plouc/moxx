const parseUrl  = require('url').parse


module.exports = req => {
    const { headers, method, url } = req
    const { pathname, query }      = parseUrl(url, true)

    const info = {
        method,
        url,
        pathname,
        query,
        headers,
    }

    return info
}