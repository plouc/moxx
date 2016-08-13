const test     = require('ava')
const matchers = require('../../../lib/matchers/matchers')


test('exists()', t => {
    t.is(matchers.exists(undefined), false)
    t.is(matchers.exists('exists'), true)
})

test('equals()', t => {
    t.is(matchers.equals('a', 'a'), true)
    t.is(matchers.equals('a', 'b'), false)
})

test('includes()', t => {
    t.is(matchers.includes('a cat', 'cat'), true)
    t.is(matchers.includes('a cat', 'dog'), false)
})

test('fromSpec() should handle exists matcher', t => {
    t.is(matchers.fromSpec({ exists: true }, false), true)
    t.is(matchers.fromSpec({ exists: false }, undefined), true)
})

test('fromSpec() should handle equals matcher', t => {
    t.is(matchers.fromSpec('a', 'a'), true)
    t.is(matchers.fromSpec('a', 'b'), false)
    t.is(matchers.fromSpec({ equals: 'a' }, 'a'), true)
    t.is(matchers.fromSpec({ equals: 'b' }, 'a'), false)
})

test('fromSpec() should handle includes matcher', t => {
    t.is(matchers.fromSpec({ includes: 'cat' }, 'a cat'), true)
    t.is(matchers.fromSpec({ includes: 'dog' }, 'a cat'), false)
})
