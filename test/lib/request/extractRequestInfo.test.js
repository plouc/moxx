const test = require('ava')
const {
    RequestMock,
    MultipartRequestMock,
} = require('../../RequestMock')

const extractRequestInfo = require('../../../lib/request/extractRequestInfo')


test('should returns info about the request', t => {
    const incomingRequest = new RequestMock({
        method:  'GET',
        url:     '/test/extract/request/info?mock=true&pass=true',
        headers: {
            'accept': '*/*',
        },
    })

    return extractRequestInfo(incomingRequest).then(reqInfo => {
        t.deepEqual(
            reqInfo,
            {
                method:  'GET',
                url:     '/test/extract/request/info?mock=true&pass=true',
                query:   {
                    mock: 'true',
                    pass: 'true',
                },
                headers: {
                    'accept': '*/*',
                },
            }
        )
    })
})

test('should parse json body', t => {
    const json = {
        id:   13,
        name: 'plouc'
    }

    const incomingRequest = new RequestMock(
        {
            method:  'POST',
            url:     '/',
            headers: {
                'content-type':   'application/json',
                'content-length': 10,
            },
        },
        { json }
    )

    return extractRequestInfo(incomingRequest).then(reqInfo => {
        t.deepEqual(
            reqInfo,
            {
                method:  'POST',
                url:     '/',
                query:   {},
                headers: {
                    'content-type': 'application/json',
                    'content-length': 10,
                },
                bodyString: incomingRequest.getRawBody(),
                json,
            }
        )
    })
})

test('should reject when json is not valid', t => {
    const incomingRequest = new RequestMock(
        {
            method:  'POST',
            url:     '/',
            headers: {
                'content-type':   'application/json',
                'content-length': 10,
            },
        },
        { raw: 'invalid' }
    )

    t.throws(extractRequestInfo(incomingRequest), err => {
        t.truthy(err instanceof Error)
        t.regex(err.message, /an error occurred while parsing request json/)
        return true
    })
})

test('should parse xml body', t => {
    const xml = {
        user: {
            id:   '13',
            name: 'plouc',
        },
    }

    const incomingRequest = new RequestMock(
        {
            method:  'POST',
            url:     '/',
            headers: {
                'content-type':   'text/xml',
                'content-length': 10,
            },
        },
        { xml }
    )

    return extractRequestInfo(incomingRequest).then(reqInfo => {
        t.deepEqual(
            reqInfo,
            {
                method:  'POST',
                url:     '/',
                query:   {},
                headers: {
                    'content-type':   'text/xml',
                    'content-length': 10,
                },
                bodyString: incomingRequest.getRawBody(),
                xml,
            }
        )
    })
})

test('should reject when xml is not valid', t => {
    const incomingRequest = new RequestMock(
        {
            method:  'POST',
            url:     '/',
            headers: {
                'content-type':   'text/xml',
                'content-length': 10,
            },
        },
        { raw: 'invalid' }
    )

    t.throws(extractRequestInfo(incomingRequest), err => {
        t.truthy(err instanceof Error)
        t.regex(err.message, /an error occurred while parsing request xml/)
        return true
    })
})

test('should parse urlencoded form data', t => {
    const incomingRequest = new RequestMock(
        {
            method:  'POST',
            url:     '/',
            headers: {
                'content-type':   'application/x-www-form-urlencoded',
                'content-length': 10,
            },
        },
        { raw: 'test=true&pass=maybe' }
    )

    return extractRequestInfo(incomingRequest).then(reqInfo => {
        t.deepEqual(
            reqInfo,
            {
                method:  'POST',
                url:     '/',
                query:   {},
                headers: {
                    'content-type':   'application/x-www-form-urlencoded',
                    'content-length': 10,
                },
                form: {
                    test: 'true',
                    pass: 'maybe',
                },
            }
        )
    })
})

test('should parse multipart form data', t => {
    const incomingRequest = new MultipartRequestMock(
        {
            method:  'POST',
            url:     '/',
            headers: {
                'content-length': 10,
            },
            fields: {
                test: 'true',
                pass: 'maybe',
            },
        },
    )

    return extractRequestInfo(incomingRequest).then(reqInfo => {
        t.deepEqual(
            reqInfo,
            {
                method:  'POST',
                url:     '/',
                query:   {},
                headers: {
                    'content-length': 10,
                    'content-type':   'multipart/form-data',
                },
                form: {
                    test: 'true',
                    pass: 'maybe',
                },
            }
        )
    })
})

test('should extract files', t => {
    const incomingRequest = new MultipartRequestMock(
        {
            method:  'POST',
            url:     '/',
            headers: {
                'content-length': 10,
            },
            files: {
                file: 'plouc.png',
            },
        },
    )

    return extractRequestInfo(incomingRequest).then(reqInfo => {
        t.deepEqual(
            reqInfo,
            {
                method:  'POST',
                url:     '/',
                query:   {},
                headers: {
                    'content-length': 10,
                    'content-type':   'multipart/form-data',
                },
                files: {
                    files: [
                        {
                            fieldname: 'file',
                            filename:  'plouc.png',
                            mimetype:  'image/png',
                            checksum:  '049d9c8330df21e891e214681ec02b8f',
                        }
                    ],
                },
            }
        )
    })
})
