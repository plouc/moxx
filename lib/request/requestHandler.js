const util               = require('util')
const extractRequestInfo = require('./extractRequestInfo')
const matchRequest       = require('./matchRequest')
const generateResponse   = require('../response/generateResponse')
const logger             = require('../logger')


/**
 * @param {Configuration} config
 * @param {MappingEntry}  mapping
 * @returns {function}
 */
module.exports = (config, mapping) => {
    /**
     * @param {http.IncomingMessage} req
     * @param {http.ServerResponse}  res
     * @returns {Promise<void>}
     */
    return (req, res) => {
        return extractRequestInfo(req)
            .then((requestInfo) => {
                logger.info(`request: ${requestInfo.method} ${requestInfo.url}`)
                logger.verbose(util.inspect(requestInfo, { depth: null, colors: true }))

                const matches = matchRequest(requestInfo, mapping)

                if (matches.length) {
                    logger.info(`matching mappings: "${matches.map(({ id }) => id).join('", "')}"`)
                    logger.silly(`matching mappings details:\n${util.inspect(matches, { depth: null, colors: true })}`)
                } else {
                    logger.info('no match')
                }

                return generateResponse(config, matches, req, res)
            })
            .catch((err) => {
                logger.error(err)

                res.writeHead(500)
                res.write(`moxx error: ${err.message}`)
            })
            .then(() => res.end())
    }
}