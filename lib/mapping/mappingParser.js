const yaml   = require('js-yaml')
const logger = require('../logger')


const parseMapping = ({ filename, content }) => new Promise((resolve, reject) => {
    try {
        const mapping = yaml.safeLoad(content)
        if (!Array.isArray(mapping)) {
            logger.warn(`skipping invalid mapping "${filename}"`)
            return resolve([])
        }

        resolve(mapping)
    } catch (err) {
        logger.warn(`skipping invalid mapping "${filename}": ${err.message}`)
        resolve([])
    }
})

module.exports.parseMappings = rawMappings => Promise.all(rawMappings.map(parseMapping))
    .then(mappings => [].concat(...mappings))
