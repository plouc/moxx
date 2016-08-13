const minimatch = require('minimatch')


module.exports = (spec, request) => {
    if (spec.url === undefined) return 0

    if (!minimatch(request.url, spec.url)) {
        console.log('- url does not match -1')
        return -1
    }

    console.log('- url matches +1')
    return 1
}
