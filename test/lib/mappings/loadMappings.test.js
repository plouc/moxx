const test         = require('ava')
const loadMappings = require('../../../lib/mappings').load


test('should load mappings', t => {
    return loadMappings('../../fixtures/mappings/valid').then(mapping => {
        t.deepEqual(mapping, [
            { request: {}, response: { body: 'mapping-1' }, id: 'mapping-1' },
            { request: {}, response: { body: 'mapping-2' }, id: 'mapping-2' },
        ])
    })
})

test('should return empty mapping when mapping file is empty', t => {
    return loadMappings('../../fixtures/mappings/empty').then(mapping => {
        t.deepEqual(mapping, [])
    })
})

test('should fail on duplicated keys in single file', t => {
    t.throws(loadMappings('../../fixtures/mappings/key-dupe-single'), err => {
        t.regex(err, /duplicated mapping key/)
        return true
    })
})

test('should fail on duplicated keys in multiple files', t => {
    t.throws(loadMappings('../../fixtures/mappings/key-dupe-multi'), err => {
        t.regex(err, /duplicated mapping key/)
        return true
    })
})
