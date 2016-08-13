const path       = require('path')
const fs         = require('fs')
const _          = require('lodash')
const fileSystem = require('./fileSystem')
const yaml       = require('js-yaml')


module.exports.create = config => {
    const timestamp = Date.now()

    return Promise.all([
        Promise.resolve(fs.createWriteStream(path.join(config.mappingsDir, `session-${timestamp}.yml`))),
        fileSystem.createDirectory(path.join(config.filesDir, `session-${timestamp}`)),
    ])
        .then(([mappingStream]) => {
            return {
                addMapping: mapping => {
                    mappingStream.write(`${yaml.safeDump([mapping])}\n`)
                }
            }
        })
}
