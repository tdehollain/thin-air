const winston = require('winston');

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            colorize: true
        })
    ]
});

logger.level = 'debug';

module.exports.lg = logger;