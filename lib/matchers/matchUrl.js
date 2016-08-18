const minimatch = require('minimatch')
const logger    = require('../logger')


/**
 * @param {MappingRequest} spec
 * @param {RequestInfo}    requestInfo
 * @returns {number}
 */
module.exports = (spec, requestInfo) => {
    if (spec.url === undefined) return 0

    if (!minimatch(requestInfo.url, spec.url)) {
        logger.silly('url does not match -1')
        return -1
    }

    logger.silly('url matches +1')
    return 1
}
