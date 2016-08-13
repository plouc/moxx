const matchers = require('./matchers')
const logger   = require('../logger')


module.exports = (spec, request) => {
    if (spec.query === undefined) return 0

    let score = 0
    for (let paramName in spec.query) {
        if (!matchers.fromSpec(spec.query[paramName], request.query[paramName])) {
            logger.silly(`query param "${paramName}" does not match -1, found "${request.query[paramName]}" (expected: ${JSON.stringify(spec.query[paramName])})`)
            return -1
        } else {
            logger.silly(`query param "${paramName}" matches +1`)
            score += 1
        }
    }

    return score
}
