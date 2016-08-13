const _                  = require('lodash')
const util               = require('util')
const extractRequestInfo = require('../request/extractRequestInfo')
const logger             = require('../logger')


module.exports = recorder => {
    return (proxyRes, req) => {
        const reqInfo = extractRequestInfo(req)

        logger.info(`request: ${reqInfo.method} ${reqInfo.url}`)
        logger.verbose(util.inspect(reqInfo, { depth: null, colors: true }))

        if (recorder) {
            let body = ''
            proxyRes.on('data', chunk => { body += chunk })
            proxyRes.on('end', () => {
                recorder.addMapping({
                    request:  _.pick(reqInfo, ['method', 'url', 'query', 'headers']),
                    response: {
                        headers: proxyRes.headers,
                        body,
                    },
                })
            })
        }
    }
}