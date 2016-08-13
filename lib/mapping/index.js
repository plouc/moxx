const fileSystem       = require('../fileSystem')
const mappingParser    = require('./mappingParser')
const mappingValidator = require('./mappingValidator')
const logger           = require('../logger')


/**
 *
 * @param {String} mappingDir
 * @returns {Promise.<TResult>}
 */
const getMappingContents = mappingDir => {
    return fileSystem.globber(`${mappingDir}/**/*.yml`)
        .then(mappingFiles => Promise.all(mappingFiles.map(filename => {
            return fileSystem.readFile(filename).then(content => ({ filename, content }))
        })))
}

/**
 *
 * @param {String} mappingDir
 * @returns {Promise.<TResult>}
 */
module.exports.load = mappingDir => {
    return getMappingContents(mappingDir)
        .then(mappingChunks => {
            logger.verbose(`mapping files: ${mappingChunks.map(({ filename }) => `${filename}` ).join(', ')}`)
            return mappingParser.parseMappings(mappingChunks)
        })
        .then(mapping => mappingValidator.validate(mapping))
}