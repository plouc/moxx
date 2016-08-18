const logger = require('../logger')


/**
 * @param {MappingRequest} spec
 * @param {RequestInfo}    requestInfo
 * @returns {number}
 */
module.exports = (spec, requestInfo) => {
    if (spec.method === undefined || spec.method === '*') return 0

    if (spec.method !== requestInfo.method) {
        logger.silly(`http method does not match, expected "${spec.method}", found "${requestInfo.method}" -1`)
        return -1
    }

    logger.silly(`http method matches (${spec.method}) +1`)
    return 1
}
