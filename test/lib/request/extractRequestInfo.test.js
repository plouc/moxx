const test               = require('ava')
const extractRequestInfo = require('../../../lib/request/extractRequestInfo')


test('should returns info about the request', t => {
    t.deepEqual(
        extractRequestInfo({
            method:  'GET',
            url:     '/test/extract/request/info?mock=true&pass=true',
            headers: {
                'content-type': 'application/json',
            },
        }),
        {
            method:   'GET',
            url:      '/test/extract/request/info?mock=true&pass=true',
            query:    {
                mock: 'true',
                pass: 'true',
            },
            headers:  {
                'content-type': 'application/json',
            },
        }
    )
})
