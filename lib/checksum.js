const crypto = require('crypto')


/**
 * @param {string} str
 * @param {string} algorithm
 * @param {string} outputEncoding
 * @returns {string}
 */
module.exports = (str, algorithm = 'md5', outputEncoding = 'hex') => {
    return crypto
        .createHash(algorithm)
        .update(str, 'utf8')
        .digest(outputEncoding)
}
