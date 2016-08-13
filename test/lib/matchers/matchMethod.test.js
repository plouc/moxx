const test        = require('ava')
const matchMethod = require('../../../lib/matchers/matchMethod')


test('should return a score of 0 when undefined', t => {
    t.is(matchMethod({}, {}), 0)
})

test('should return a score of -1 when no match found', t => {
    t.is(matchMethod({ method: 'GET' }, { method: 'POST' }), -1)
})

test('should return a score of 1 when match found', t => {
    t.is(matchMethod({ method: 'GET' }, { method: 'GET' }), 1)
})
