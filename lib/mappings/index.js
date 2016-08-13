const fileSystem       = require('../fileSystem')
const mappingParser    = require('./mappingParser')
const mappingValidator = require('./mappingValidator')
const logger           = require('../logger')


/**
 *
 * @param {String} mappingsDir
 * @returns {Promise.<TResult>}
 */
const getMappingContents = mappingsDir => {
    return fileSystem.globber(`${mappingsDir}/**/*.yml`)
        .then(mappingFiles => Promise.all(mappingFiles.map(filename => {
            return fileSystem.readFile(filename).then(content => ({ filename, content }))
        })))
}

/**
 *
 * @param {String} mappingsDir
 * @returns {Promise.<TResult>}
 */
module.exports.load = mappingsDir => {
    return getMappingContents(mappingsDir)
        .then(mappingChunks => {
            logger.verbose(`mapping files: ${mappingChunks.map(({ filename }) => `${filename}` ).join(', ')}`)
            return mappingParser.parseMappings(mappingChunks)
        })
        .then(mappingValidator.validate)
}