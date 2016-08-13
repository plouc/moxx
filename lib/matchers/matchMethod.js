const logger = require('../logger')


module.exports = (spec, request) => {
    if (spec.method === undefined || spec.method === '*') return 0

    if (spec.method !== request.method) {
        logger.silly('http method does not match -1')
        return -1
    }

    logger.silly('http method matches +1')
    return 1
}
