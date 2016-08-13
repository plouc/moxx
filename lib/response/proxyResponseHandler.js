const _                  = require('lodash')
const util               = require('util')
const extractRequestInfo = require('../request/extractRequestInfo')


module.exports = recorder => {
    return (proxyRes, req, res) => {
        const reqInfo = extractRequestInfo(req)
        console.log('<— incoming request:')
        console.log(util.inspect(reqInfo, { depth: null, colors: true }))

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