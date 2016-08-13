const test             = require('ava')
const mappingValidator = require('../../../lib/mappings/mappingValidator')


test('should pass with valid request method', t => {
    const mapping = {
        id:       'valid',
        request:  { method: 'GET' },
        response: { body: 'test' },
    }

    return mappingValidator.validate([mapping]).then(() => t.pass())
})

test('should allow wildcard request method', t => {
    const mapping = {
        id:       'valid',
        request:  { method: '*' },
        response: { body: 'test' },
    }

    return mappingValidator.validate([mapping]).then(() => t.pass())
})

test('should not pass with invalid request method', t => {
    const mapping = {
        id:       'invalid',
        request:  { method: 'INVALID' },
        response: { body: 'test' },
    }

    t.throws(mappingValidator.validate([mapping]).then(() => t.pass()), err => {
        t.regex(err, /mapping validation failed for "invalid"/)
        t.regex(err, /"method" must be one of/)
        return true
    })
})

test('should pass with valid response status', t => {
    const mapping = {
        id:       'valid',
        request:  { method: 'GET' },
        response: { status: 400, body: 'test' },
    }

    return mappingValidator.validate([mapping]).then(() => t.pass())
})

test('should not pass with invalid response status', t => {
    const mapping = {
        id:       'invalid',
        request:  { method: 'GET' },
        response: { status: 900, body: 'test' },
    }

    t.throws(mappingValidator.validate([mapping]).then(() => t.pass()), err => {
        t.regex(err, /mapping validation failed for "invalid"/)
        t.regex(err, /"status" must be one of/)
        return true
    })
})

test('should not pass when response have no body directive', t => {
    const mapping = {
        id:       'invalid',
        request:  {},
        response: {},
    }

    t.throws(mappingValidator.validate([mapping]), err => {
        t.regex(err, /mapping validation failed for "invalid"/)
        t.regex(err, /must contain at least one of \[body, bodyFile, bodyFileTemplate\]/)
        return true
    })
})
