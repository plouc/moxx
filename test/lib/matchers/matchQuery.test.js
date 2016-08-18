const test       = require('ava')
const matchQuery = require('../../../lib/matchers/matchQuery')


test('should return a score of 0 when undefined', t => {
    t.is(matchQuery({}, {}), 0)
})

test('should return a score of -1 when no match found', t => {
    t.is(matchQuery(
        { query: { 'test': 'true' } },
        { query: {} }
    ), -1)
})

test('should return a score of 1 when match found', t => {
    t.is(matchQuery(
        { query: { 'test': 'true' } },
        { query: { 'test': 'true' } }
    ), 1)
})
