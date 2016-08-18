const test     = require('ava')
const checksum = require('../../lib/checksum')


test('should compute md5 hash from string', t => {
    t.is(checksum('hello'), '5d41402abc4b2a76b9719d911017c592')
})

test('should compute sha1 hash from string', t => {
    t.is(checksum('hello', 'sha1'), 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d')
})

test('should support specific encoding', t => {
    t.is(checksum('hello', undefined, 'base64'), 'XUFAKrxLKna5cZ2REBfFkg==')
})
