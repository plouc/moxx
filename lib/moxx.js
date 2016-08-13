const path                 = require('path')
const chokidar             = require('chokidar')
const fileSystem           = require('./fileSystem')
const loadMappings         = require('./mappings').load
const Server               = require('./server')
const Recorder             = require('./recorder')
const requestHandler       = require('./request/requestHandler')
const proxyResponseHandler = require('./response/proxyResponseHandler')
const logger               = require('./logger')


/**
 * Loads mapping files and starts the server.
 *
 * @returns {Promise.<TResult>}
 */
const start = config => {
    return fileSystem.ensureLayout(config.dir)
        .then(directories => {
            config = Object.assign(config, directories)
            return loadMappings(directories.mappingsDir)
        })
        .then(mapping => Server.start(config).then(({ server, proxy }) => ({ mapping, server, proxy })))
        .then(({ mapping, server, proxy }) => {
            if (config.record) {
                return Recorder.create(config).then(recorder => ({ mapping, server, proxy, recorder }))
            }

            return { mapping, server, proxy }
        })
        .then(({ mapping, server, proxy, recorder }) => {
            if (proxy) {
                server.on('request', (req, res) => { proxy.web(req, res) })
                proxy.on('proxyRes', proxyResponseHandler(recorder))
            } else {
                server.on('request', requestHandler(config, mapping))
            }
        })
        .catch(err => {
            logger.error(err)
            process.exit(1)
        })
}


/**
 *
 * @param {Object} config
 * @returns {Promise.<TResult>}
 */
module.exports.start = config => {
    return start(config)
        .then(() => {
            if (config.watch) {
                const watcher = chokidar.watch(path.join(config.dir, 'mappings'))

                watcher.on('change', path => {
                    logger.info(`mapping "${path}" updated, reloading`)
                    start(config)
                })
            }
        })
}