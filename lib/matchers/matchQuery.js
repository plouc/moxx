const matchers = require('./matchers')


module.exports = (spec, request) => {
    if (spec.query === undefined) return 0

    let score = 0
    for (let paramName in spec.query) {
        if (!matchers.fromSpec(spec.query[paramName], request.query[paramName])) {
            console.log(`- query param "${paramName}" does not match -1, found "${request.query[paramName]}" (expected: ${JSON.stringify(spec.query[paramName])})`)
            return -1
        } else {
            console.log(`- query param "${paramName}" matches +1`)
            score += 1
        }
    }

    return score
}
