const util               = require('util')
const _                  = require('lodash')
const extractRequestInfo = require('../request/extractRequestInfo')
const logger             = require('../logger')


/**
 * @param {Recorder} recorder
 * @returns {function}
 */
module.exports = (recorder) => {
    /**
     * @param {http.ServerResponse}  proxyRes
     * @param {http.IncomingMessage} req
     * @returns {Promise<void>}
     */
    return (proxyRes, req) => {
        return extractRequestInfo(req)
            .then((requestInfo) => {
                logger.info(`request: ${requestInfo.method} ${requestInfo.url}`)
                logger.info(`> ${proxyRes.statusCode} ${proxyRes.statusMessage}`)
                logger.verbose(util.inspect(requestInfo, { depth: null, colors: true }))

                if (recorder) {
                    let body = ''
                    proxyRes.on('data', chunk => { body += chunk })
                    proxyRes.on('end', () => {
                        recorder.addMapping({
                            request:  _.pick(requestInfo, ['method', 'url', 'query', 'headers']),
                            response: {
                                headers: proxyRes.headers,
                                body,
                            },
                        })
                    })
                }
            })
    }
}