const _      = require('lodash')
const yaml   = require('js-yaml')
const logger = require('../logger')


const parseMapping = ({ filename, content }) => new Promise((resolve, reject) => {
    try {
        if (content === '') {
            logger.warn(`skipping empty mapping "${filename}"`)
            return resolve({})
        }

        const mapping = yaml.safeLoad(content)
        resolve({ filename, mapping })
    } catch (err) {
        reject(`invalid mapping "${filename}": ${err.message}`)
    }
})

const aggregateMappings = chunks => {
    const mappings = {}

    for (let i = 0; i < chunks.length; i++) {
        const { filename, mapping } = chunks[i]
        for (let mappingId in mapping) {
            if (mappings[mappingId]) {
                return Promise.reject(`duplicated mapping key "${mappingId}" in ${filename}`)
            }

            mappings[mappingId] = Object.assign(mapping[mappingId], { id: mappingId })
        }
    }

    return _.values(mappings)
}

module.exports.parseMappings = rawMappings => {
    return Promise.all(rawMappings.map(parseMapping))
        .then(aggregateMappings)
}
