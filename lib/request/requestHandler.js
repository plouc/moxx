const util               = require('util')
const extractRequestInfo = require('./extractRequestInfo')
const matchRequest       = require('./matchRequest')
const generateResponse   = require('../response/generateResponse')
const logger             = require('../logger')


module.exports = (config, mapping) => {
    return (req, res) => {
        const reqInfo = extractRequestInfo(req)

        logger.info(`request: ${reqInfo.method} ${reqInfo.url}`)
        logger.verbose(util.inspect(reqInfo, { depth: null, colors: true }))

        const matches = matchRequest(reqInfo, mapping)

        if (matches.length) {
            logger.info(`matched mappings: "${matches.map(({ id }) => id).join('", "')}"`)
            logger.silly(util.inspect(matches, { depth: null, colors: true }))
        } else {
            logger.info('no match')
        }

        generateResponse(config, matches, req, res)
            .catch(err => {
                res.writeHead(500)
                res.write(`moxx error: ${err.message}`)
            })
            .then(() => res.end())
    }
}