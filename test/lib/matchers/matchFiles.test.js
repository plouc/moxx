const test       = require('ava')
const matchFiles = require('../../../lib/matchers/matchFiles')


test('should return a score of 0 if no files defined on mapping', t => {
    t.is(matchFiles({}, {}), 0)
})

test('should return a positive score if file count matches', t => {
    t.is(matchFiles(
        { files: { count: 2 } },
        { files: [{}, {}] }
    ), 1)
})

test('should return -1 if file count does not match', t => {
    t.is(matchFiles(
        { files: { count: 1 } },
        { files: [{}, {}] }
    ), -1)
})

test('should return a positive score if fieldname matches', t => {
    t.is(matchFiles(
        { files: { files: [{ fieldname: 'myfile' }] } },
        { files: { files: [{ fieldname: 'myfile'  }] } }
    ), 1)
})

test('should return -1 if fieldname does not matches', t => {
    t.is(matchFiles(
        { files: { files: [{ fieldname: 'myfile' }] } },
        { files: { files: [{ fieldname: 'other'  }] } }
    ), -1)
})

test('should return a positive score if checksum matches', t => {
    t.is(matchFiles(
        { files: { files: [{ checksum: 'check' }] } },
        { files: { files: [{ checksum: 'check'  }] } }
    ), 1)
})

test('should return -1 if checksum does not matches', t => {
    t.is(matchFiles(
        { files: { files: [{ checksum: 'check' }] } },
        { files: { files: [{ checksum: 'other'  }] } }
    ), -1)
})
