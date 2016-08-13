const requestMatchers = require('../matchers')
const logger          = require('../logger')


const matchers = [
    requestMatchers.matchMethod,
    requestMatchers.matchUrl,
    requestMatchers.matchQuery,
    requestMatchers.matchHeaders,
]


module.exports = (req, mapping) => {
    let scores = []

    mapping.forEach((entry, i) => {
        const { id, request } = entry

        scores[i] = 0

        logger.verbose(`testing request for "${id}"`)

        for (let j = 0; j < matchers.length; j++) {
            const matcher = matchers[j]
            const result  = matcher(request, req)
            if (result === -1) {
                scores[i] = -1
                return
            }

            scores[i] += result
        }
    })

    const matches = scores.map((score, index) => [index, score])
        .filter(([index, score]) => score !== -1)
        .sort(([indexA, scoreA], [indexB, scoreB]) => scoreA - scoreB)
        .reverse()
        .map(([index, score]) => {
            logger.verbose(`score for "${mapping[index].id}": ${score}`)

            return mapping[index]
        })

    return matches
}