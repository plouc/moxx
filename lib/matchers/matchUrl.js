const minimatch = require('minimatch')
const logger    = require('../logger')


module.exports = (spec, request) => {
    if (spec.url === undefined) return 0

    if (!minimatch(request.url, spec.url)) {
        logger.silly('url does not match -1')
        return -1
    }

    logger.silly('url matches +1')
    return 1
}
