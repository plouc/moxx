module.exports = (spec, request) => {
    if (spec.method === undefined || spec.method === '*') return 0

    if (spec.method !== request.method) {
        console.log('- http method does not match -1')
        return -1
    }

    console.log('- http method matches +1')
    return 1
}
