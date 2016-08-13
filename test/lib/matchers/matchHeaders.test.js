const test         = require('ava')
const matchHeaders = require('../../../lib/matchers/matchHeaders')

test('should return a score of 0 when undefined', t => {
    t.is(matchHeaders({}, {}), 0)
})

test('should return a score of -1 when no match found', t => {
    t.is(matchHeaders(
        { headers: { 'content-type': 'application/json' } },
        { headers: {} }
    ), -1)
})

test('should return a score of 1 when match found', t => {
    t.is(matchHeaders(
        { headers: { 'content-type': 'application/json' } },
        { headers: { 'content-type': 'application/json' } }
    ), 1)
})
