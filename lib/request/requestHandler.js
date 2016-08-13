const util               = require('util')
const extractRequestInfo = require('./extractRequestInfo')
const matchRequest       = require('./matchRequest')
const generateResponse   = require('../response/generateResponse')


module.exports = (config, mapping) => {
    return (req, res) => {
        const reqInfo = extractRequestInfo(req)

        console.log('<— incoming request:')
        console.log(util.inspect(reqInfo, { depth: null, colors: true }))

        const matches = matchRequest(reqInfo, mapping)

        console.log('matching mappings:')
        console.log(util.inspect(matches, { depth: null, colors: true }))

        generateResponse(config, matches, req, res)
            .catch(err => {
                res.writeHead(500)
                res.write(`moxx error: ${err.message}`)
            })
            .then(() => res.end())
    }
}