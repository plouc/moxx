const test     = require('ava')
const matchUrl = require('../../../lib/matchers/matchUrl')


test('should return a score of 0 when undefined', t => {
    t.is(matchUrl({}, {}), 0)
})

test('should return a score of -1 when no match found', t => {
    t.is(matchUrl({ url: '/match' }, { url: '/no_match' }), -1)
    t.is(matchUrl({ url: '/match' }, { url: '/match/plus' }), -1)
})

test('should return a score of 1 when match found', t => {
    t.is(matchUrl({ url: '/match/*' }, { url: '/match/plus' }), 1)
    t.is(matchUrl({ url: '/match/*/plus' }, { url: '/match/plus/plus' }), 1)
    t.is(matchUrl({ url: '/match/**' }, { url: '/match/plus/plus' }), 1)
    t.is(matchUrl({ url: '/match/**' }, { url: '/match/plus/plus?test=true&mock=true' }), 1)
})

