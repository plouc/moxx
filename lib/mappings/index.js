const fileSystem        = require('../fileSystem')
const mappingParser     = require('./mappingParser')
const mappingValidator  = require('./mappingValidator')
const generateMappingId = require('./generateMappingId')
const logger            = require('../logger')


/**
 * @typedef {Object} MappingRequest
 * @property {string} [method]
 */

/**
 * @typedef {Object} MappingResponse
 * @property {body} string
 */

/**
 * @typedef {Object} MappingEntry
 * @property {id}              string
 * @property {MappingRequest}  request
 * @property {MappingResponse} response
 */

/**
 * @typedef {Array<MappingEntry>} Mapping
 */

/**
 * @param {string} mappingsDir
 * @returns {Promise<Array<{ filename: string, content: string }>>}
 */
const getMappingContents = (mappingsDir) => {
    return fileSystem.globber(`${mappingsDir}/**/*.yml`)
        .then(mappingFiles => {
            return Promise.all(mappingFiles.map(filename => {
                return fileSystem.readFile(filename)
                    .then(content => ({ filename, content }))
            }))
        })
}

/**
 * @param {string} mappingsDir
 * @returns {Promise.<Mapping>}
 */
const loadMappings = (mappingsDir) => {
    return getMappingContents(mappingsDir)
        .then(mappingChunks => {
            logger.verbose(`mapping files: ${mappingChunks.map(({ filename }) => `${filename}` ).join(', ')}`)
            return mappingParser.parseMappings(mappingChunks)
        })
        .then(mappingValidator.validate)
}


module.exports.load              = loadMappings
module.exports.generateMappingId = generateMappingId
