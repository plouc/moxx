/**
 * @param {*} value
 * @returns {boolean}
 */
const exists = (value) => {
    return value !== undefined
}

/**
 * @param {*} value
 * @param {*} expected
 * @returns {boolean}
 */
const equals = (value, expected) => {
    return value == expected
}

/**
 * @param {string|Array} value
 * @param search
 * @returns {boolean}
 */
const includes = (value, search) => {
    return value.includes(search)
}

/**
 * @param {string|Object} spec
 * @param {*}             value
 * @returns {boolean}
 */
const matcherFromSpec = (spec, value) => {
    if (typeof spec === 'string' || typeof spec === 'number') {
        return equals(value, spec)
    } else if (spec.equals) {
        return equals(value, spec.equals)
    } else if (spec.includes) {
        return includes(value, spec.includes)
    } else if (spec.hasOwnProperty('exists')) {
        return exists(value) === spec.exists
    }

    return false
}


module.exports.exists   = exists
module.exports.equals   = equals
module.exports.includes = includes
module.exports.fromSpec = matcherFromSpec
