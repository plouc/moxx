const http = require('http')
const Joi  = require('joi')


const statusCodes = Object.keys(http.STATUS_CODES).map(status => parseInt(status, 10))

const keyWithMatcherSchema = Joi.object().keys({}).pattern(/.*/, Joi.alternatives().try([
    Joi.string(),
    Joi.object().keys({
        exists:   Joi.boolean(),
        equals:   Joi.any(),
        includes: Joi.string(),
    }),
]))

const schema = Joi.object().keys({
    request: Joi.object().required().keys({
        method:  Joi.string().valid(http.METHODS.concat('*')),
        url:     Joi.string(),
        headers: keyWithMatcherSchema,
        query:   keyWithMatcherSchema,
    }),
    response: Joi.object().required().keys({
        status:           Joi.alternatives().try([
            Joi.any().valid(statusCodes),
        ]),
        body:             Joi.string(),
        bodyFileTemplate: Joi.string(),
        headers:          Joi.object().keys({}).pattern(/.*/, Joi.alternatives().try([
            Joi.string(),
            Joi.number(),
        ]))
    }).xor('body', 'bodyFile', 'bodyFileTemplate'),
})

const validate = mappingEntry => new Promise((resolve, reject) => {
    const options = {
        abortEarly:   false,
        convert:      true,
        allowUnknown: true,
    }

    Joi.validate(mappingEntry, schema, options, (err, validatedMapping) => {
        if (err) {
            return reject(`mapping validation failed: ${err.message}\n> ${JSON.stringify(mappingEntry)}`)
        }

        resolve(validatedMapping)
    })
})


module.exports.validate = mapping => Promise.all(mapping.map(validate))

