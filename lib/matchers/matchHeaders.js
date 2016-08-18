const matchers = require('./matchers')
const logger   = require('../logger')


/**
 * @param {MappingRequest} spec
 * @param {RequestInfo}    requestInfo
 * @returns {number}
 */
module.exports = (spec, requestInfo) => {
    if (spec.headers === undefined) return 0

    let score = 0
    for (let header in spec.headers) {
        if (!matchers.fromSpec(spec.headers[header], requestInfo.headers[header])) {
            logger.silly(`header "${header}" does not match -1, found "${requestInfo.headers[header]}" (expected: ${JSON.stringify(spec.headers[header])})`)
            return -1
        } else {
            logger.silly(`header "${header}" matches +1`)
            score += 1
        }
    }

    return score
}
