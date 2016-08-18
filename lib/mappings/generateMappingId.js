const crypto   = require('crypto')
const parseUrl = require('url').parse


/**
 * Generates a unique id for given mapping request.
 *
 * @param {MappingRequest} request
 * @returns {string}
 */
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
        if (parsedUrl.query) {
            query = parsedUrl.query
        }
        if (parsedUrl.pathname) {
            id += parsedUrl.pathname.replace(/\//g, '_')
        }
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