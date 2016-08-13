const exists = value => value !== undefined

const equals = (value, expected) => value == expected

const includes = (value, search) => value.includes(search)

module.exports.exists   = exists
module.exports.equals   = equals
module.exports.includes = includes

module.exports.fromSpec = (spec, value) => {
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
