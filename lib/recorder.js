const path       = require('path')
const fs         = require('fs')
const _          = require('lodash')
const yaml       = require('js-yaml')
const fileSystem = require('./fileSystem')
const generateId = require('./mappings').generateMappingId


module.exports.create = config => {
    const time            = (new Date()).toISOString().replace(/[:\.]/g, '-')
    const sessionFilesDir = `session-${time}`

    return Promise.all([
        Promise.resolve(fs.createWriteStream(path.join(config.mappingsDir, `session-${time}.yml`))),
        fileSystem.createDirectory(path.join(config.filesDir, sessionFilesDir)),
    ])
        .then(([mappingStream]) => {
            return {
                addMapping: mapping => {
                    const body      = mapping.response.body
                    const mappingId = generateId(mapping)
                    const filePath  = path.join(sessionFilesDir, `${mappingId}.txt`)

                    fileSystem.writeFile(path.join(config.filesDir, filePath), body).then(() => {
                        mappingStream.write(`${yaml.safeDump({
                            [mappingId]: Object.assign({}, mapping, {
                                response: Object.assign(_.omit(mapping.response, 'body'), {
                                    bodyFile: filePath,
                                }),
                            })
                        })}\n`)
                    })
                }
            }
        })
}
