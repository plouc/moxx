const matchers = require('./matchers')
const logger   = require('../logger')


/**
 * @param {MappingRequest} spec
 * @param {RequestInfo}    requestInfo
 * @returns {number}
 */
module.exports = (spec, requestInfo) => {
    if (spec.query === undefined) return 0

    let score = 0
    for (let paramName in spec.query) {
        if (!matchers.fromSpec(spec.query[paramName], requestInfo.query[paramName])) {
            logger.silly(`query param "${paramName}" does not match -1, found "${requestInfo.query[paramName]}" (expected: ${JSON.stringify(spec.query[paramName])})`)
            return -1
        } else {
            logger.silly(`query param "${paramName}" matches +1`)
            score += 1
        }
    }

    return score
}
