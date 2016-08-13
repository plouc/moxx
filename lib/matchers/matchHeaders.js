const matchers = require('./matchers')
const logger   = require('../logger')


module.exports = (spec, request) => {
    if (spec.headers === undefined) return 0

    let score = 0
    for (let header in spec.headers) {
        if (!matchers.fromSpec(spec.headers[header], request.headers[header])) {
            logger.silly(`header "${header}" does not match -1, found "${request.headers[header]}" (expected: ${JSON.stringify(spec.headers[header])})`)
            return -1
        } else {
            logger.silly(`header "${header}" matches +1`)
            score += 1
        }
    }

    return score
}
