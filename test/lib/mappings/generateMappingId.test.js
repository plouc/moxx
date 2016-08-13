const test     = require('ava')
const generate = require('../../../lib/mappings/generateMappingId')


test('should generate an id from a mapping object', t => {
    t.is(generate({ request: { method: 'GET', url: '/users' } }), 'get_users')
    t.is(generate({ request: { method: '*', url: '/users' } }), 'any_users')
    t.is(generate({ request: { method: 'GET', url: '/users/2' } }), 'get_users_2')
    t.is(generate({ request: { method: 'GET', url: '/users/2/profile' } }), 'get_users_2_profile')
})

test('should vary on query parameters', t => {
    t.regex(generate({ request: { method: 'GET', url: '/users?p=1' } }), /^get_users_[a-z0-9]{10}$/)
    t.regex(generate({ request: { method: 'GET', url: '/users/2/profile?embed=address' } }), /^get_users_2_profile_[a-z0-9]{10}$/)
})

test('should vary on headers', t => {
    t.regex(generate({
        request: {
            method:  'GET',
            url:     '/users',
            headers: { accept: '*/*' }
        }
    }), /^get_users_[a-z0-9]{10}$/)
    t.regex(generate({
        request: {
            method:  'GET',
            url:     '/users/2/profile',
            headers: { accept: '*/*' }
        }
    }), /^get_users_2_profile_[a-z0-9]{10}$/)
})

test('should be idempotent', t => {
    t.is(
        generate({ request: { method: 'GET', url: '/users?p=1' } }),
        generate({ request: { method: 'GET', url: '/users?p=1' } })
    )
})
