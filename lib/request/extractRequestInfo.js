const parseUrl    = require('url').parse
const util        = require('util')
const Busboy      = require('busboy')
const typeIs      = require('type-is')
const { hasBody } = typeIs
const parseXml    = require('xml2js').parseString
const checksum    = require('../checksum')
const logger      = require('../logger')

/**
 * @typedef {Object} RequestInfo
 */

/**
 * @param {RequestInfo} requestInfo
 * @returns {RequestInfo}
 */
const cleanup = (requestInfo) => {
    if (requestInfo.headers) {
        if (requestInfo.headers['content-type']) {
            requestInfo.headers['content-type'] = requestInfo.headers['content-type']
                .replace(/(multipart\/form-data); boundary=[a-z0-9-]+/, '$1')
        }
    }

    return requestInfo
}

/**
 * @param {http.IncomingMessage} request
 * @returns {Promise.<RequestInfo>}
 */
function extractRequestInfo(request) {
    return new Promise((resolve, reject) => {
        const { headers, method, url } = request
        const { query }                = parseUrl(url, true)

        /** @type {RequestInfo} */
        const info = {
            method,
            url,
            query,
            headers,
        }

        if (hasBody(request)) {
            const contentType = typeIs(request, ['json', 'text/xml', 'urlencoded', 'multipart'])

            if (['urlencoded', 'multipart'].includes(contentType)) {
                const busboy = new Busboy({ headers })
                busboy
                    .on('field',
                        /**
                         * @param {string} fieldName
                         * @param {string} fieldValue
                         */
                        (fieldName, fieldValue) => {
                            if (!info.form) info.form = {}
                            logger.silly(`field [${fieldName}]: value: ${fieldValue}`)
                            info.form[fieldName] = fieldValue
                        }
                    )
                    .on('file',
                        /**
                         * @param {string}          fieldname
                         * @param {stream.Writable} file
                         * @param {string}          filename
                         * @param {string}          encoding
                         * @param {string}          mimetype
                         */
                        (fieldname, file, filename, encoding, mimetype) => {
                            logger.verbose(`file [${fieldname}]: filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`);

                            /** @type Array<Buffer> */
                            const fileChunks = []
                            file
                                .on('data',
                                    /**
                                     * @param {Buffer} data
                                     */
                                    (data) => {
                                        logger.silly(`file [${fieldname}]: got ${data.length} bytes`)
                                        fileChunks.push(data)
                                    }
                                )
                                .on('end', () => {
                                    logger.silly(`file [${fieldname}]: finished`)

                                    const fileData = Buffer.concat(fileChunks).toString()

                                    if (!info.files)       info.files = {}
                                    if (!info.files.files) info.files.files = []
                                    info.files.files.push({
                                        fieldname,
                                        filename,
                                        mimetype,
                                        checksum: checksum(fileData),
                                    })
                               })
                        }
                    )
                    .on('finish', () => {
                        resolve(info)
                    })

                request.pipe(busboy)
            } else {
                /** @type Array<Buffer> */
                const bodyChunks = []
                request
                    .on('data',
                        /**
                         * @param {Buffer} data
                         */
                        (data) => {
                            bodyChunks.push(data)
                        }
                    )
                    .on('end', () => {
                        const body = Buffer.concat(bodyChunks).toString()

                        info.bodyString = body
                        if (contentType === 'json') {
                            try {
                                info.json = JSON.parse(body)
                            } catch (err) {
                                return reject(
                                    new Error(`an error occurred while parsing request json: ${err.message}`)
                                )
                            }
                        } else if (contentType === 'text/xml') {
                            const parserOptions = {
                                explicitArray: false, // An array is created only if there is more than one children
                                normalize:     true,  // Trim whitespaces inside text nodes
                            }
                            parseXml(body, parserOptions, (err, result) => {
                                if (err) {
                                    return reject(
                                        new Error(`an error occurred while parsing request xml: ${err.message}`)
                                    )
                                }
                                info.xml = result
                            });
                        }

                        resolve(info)
                    })
            }
        } else {
            resolve(info)
        }
    }).then(cleanup)
}


module.exports = extractRequestInfo
