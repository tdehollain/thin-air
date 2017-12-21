const winston = require('winston');
const moment = require('moment');

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            timestamp: () => {return moment().format("DD/MM/YY-h:mm")},
            colorize: true
        })
    ]
});

logger.level = 'debug';

module.exports.lg = logger;