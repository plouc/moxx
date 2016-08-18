const path             = require('path')
const { STATUS_CODES } = require('http')
const _                = require('lodash')
const fileSystem       = require('../fileSystem')
const logger           = require('../logger')


/**
 * @param {Configuration}        config
 * @param {MappingResponse}      response
 * @param {http.IncomingMessage} req
 * @returns {Promise<string>}
 */
const generateBody = (config, response, req) => {
    if (response.body) {
        return Promise.resolve(response.body)
    }

    let file
    if (response.bodyFile) {
        file = response.bodyFile
    } else {
        file = _.template(response.bodyFileTemplate)(req)
    }

    return fileSystem.readFile(path.join(config.filesDir, file))
}

/**
 * @param {Configuration}        config
 * @param {Array<MappingEntry>}  matches
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse}  res
 * @returns {Promise<*>}
 */
const generateResponse = (config, matches, req, res) => {
    const additionalHeaders = {
        'X-Generated-By': `${config.name} v${config.version}`,
    }

    if (matches.length) {
        const { response } = matches[0]

        return generateBody(config, response, req)
            .then(body => {
                const statusCode = response.status || 200

                logger.info(`> ${statusCode} ${STATUS_CODES[statusCode]}`)

                res.writeHead(response.status || 200, Object.assign(response.headers || {}, additionalHeaders))
                res.write(body)
            })
    }

    res.writeHead(404, additionalHeaders)
    res.write('moxx: not found')

    return Promise.resolve(true)
}


module.exports = generateResponse
