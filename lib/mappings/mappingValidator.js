const http = require('http')
const Joi  = require('joi')

/**
 * @type {Array<number>}
 */
const statusCodes = Object.keys(http.STATUS_CODES)
    .map((status) => parseInt(status, 10))


const matcherAlternative = Joi.alternatives().try([
    Joi.string(),
    Joi.object().keys({
        exists:   Joi.boolean(),
        equals:   Joi.any(),
        includes: Joi.string(),
    }),
])

const keyWithMatcherSchema = Joi.object().keys({})
    .pattern(/.*/, matcherAlternative)

const schema = Joi.object().keys({
    request: Joi.object().required().keys({
        method:  Joi.string().valid(http.METHODS.concat('*')),
        url:     Joi.string(),
        headers: keyWithMatcherSchema,
        query:   keyWithMatcherSchema,
        files:   Joi.object().keys({
            count: Joi.number(),
            files: Joi.array().items(
                Joi.object().keys({
                    fieldname: matcherAlternative,
                    filename:  matcherAlternative,
                    mimetype:  matcherAlternative,
                    checksum:  Joi.string(),
                })
            ),
        })
    }),
    response: Joi.object().required().keys({
        status:           Joi.alternatives().try([
            Joi.any().valid(statusCodes),
        ]),
        body:             Joi.string(),
        bodyFile:         Joi.string(),
        bodyFileTemplate: Joi.string(),
        headers:          Joi.object().keys({})
            .pattern(/.*/, Joi.alternatives().try([
                Joi.string(),
                Joi.number(),
            ])),
    }).xor('body', 'bodyFile', 'bodyFileTemplate'),
})

/**
 * @param {MappingEntry} mapping
 * @returns {Promise<MappingEntry>}
 */
const validate = (mapping) => {
    return new Promise((resolve, reject) => {
        const options = {
            abortEarly:   false,
            convert:      true,
            allowUnknown: true,
        }

        Joi.validate(mapping, schema, options,
            /**
             * @param {Error}        err
             * @param {MappingEntry} validatedMapping
             * @returns {Promise<MappingEntry>}
             */
            (err, validatedMapping) => {
                if (err) {
                    return reject(`mapping validation failed for "${mapping.id}": ${err.message}`)
                }

                resolve(validatedMapping)
            }
        )
    })
}

/**
 * @param {Mapping} mapping
 * @returns {Promise<Mapping>}
 */
module.exports.validate = (mapping) => {
    return Promise.all(mapping.map(validate))
}

