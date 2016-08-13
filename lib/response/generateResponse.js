const path             = require('path')
const { STATUS_CODES } = require('http')
const _                = require('lodash')
const fileSystem       = require('../fileSystem')
const logger           = require('../logger')


/**
 * @param {Object} config
 * @param {Object} response
 * @param {Object} req
 * @returns {Promise.<TResult>}
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
 * @param {Object}         config
 * @param {Array.<Object>} matches
 * @param {Object}         req
 * @param {Object}         res
 * @returns {Promise.<TResult>}
 */
module.exports = (config, matches, req, res) => {
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