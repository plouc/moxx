const matchers = require('./matchers')


module.exports = (spec, request) => {
    if (spec.headers === undefined) return 0

    let score = 0
    for (let header in spec.headers) {
        if (!matchers.fromSpec(spec.headers[header], request.headers[header])) {
            console.log(`- header "${header}" does not match -1, found "${request.headers[header]}" (expected: ${JSON.stringify(spec.headers[header])})`)
            return -1
        } else {
            console.log(`- header "${header}" matches +1`)
            score += 1
        }
    }

    return score
}
