const winston = require('winston')

const logger = new winston.Logger({
    level:      'error',
    transports: [
        new (winston.transports.Console)(),
    ],
})

logger.cli()

module.exports = logger
