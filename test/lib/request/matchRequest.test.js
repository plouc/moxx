const test         = require('ava')
const matchRequest = require('../../../lib/request/matchRequest')


test('should return matching requests', t => {
    const mapping = [
        {
            request: {
                method: 'GET',
                url:    '/test/**',
            },
        },
    ]

    t.deepEqual(matchRequest({
        method: 'GET',
        url:    '/test/match/request?mock=true&pass=true',
    }, mapping), [
        mapping[0],
    ])
})

test('should return an empty array if no match found', t => {
    const mapping = [
        {
            request: {
                method: 'POST',
            },
        },
    ]

    t.deepEqual(matchRequest({
        method: 'GET',
        url:    '/test/match/request?mock=true&pass=true',
    }, mapping), [])
})
