const crypto   = require('crypto')
const parseUrl = require('url').parse


module.exports = ({ request }) => {
    let id = ''

    if (request.method) {
        if (request.method === '*') {
            id += 'any'
        } else {
            id += request.method.toLowerCase()
        }
    }

    let query = request.query

    if (request.url) {
        let parsedUrl = parseUrl(request.url, true)
        let { pathname } = parsedUrl
        query = parsedUrl.query
        pathname = pathname.replace(/\//g, '_')

        id += pathname
    }

    let variant = {}
    if (query) {
        variant = Object.assign(variant, query)
    }
    if (request.headers) {
        variant = Object.assign(variant, request.headers)
    }

    if (Object.keys(variant).length) {
        const generator = crypto.createHash('sha1')
        generator.update(JSON.stringify(variant))

        id += `_${generator.digest('hex').substr(0, 10)}`
    }

    return id
}