const yaml = require('js-yaml')


const parseMapping = ({ filename, content }) => new Promise((resolve, reject) => {
    try {
        const mapping = yaml.safeLoad(content)
        if (!Array.isArray(mapping)) {
            console.log(`skipping invalid mapping "${filename}":\n"${content}"`)
            return resolve([])
        }

        resolve(mapping)
    } catch (err) {
        console.log(`skipping invalid mapping "${filename}": ${err.message}`)
        resolve([])
    }
})

module.exports.parseMappings = rawMappings => Promise.all(rawMappings.map(parseMapping))
    .then(mappings => [].concat(...mappings))
