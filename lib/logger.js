
const winston = require('winston');
const moment = require('moment');
const http = require('http');

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            timestamp: () => {return moment().format("DD/MM/YY-h:mm")},
            colorize: true
        })
    ]
});

const postToLoggly = function(type, text) {
    let options = {
        hostname: 'logs-01.loggly.com',
        path: '/inputs/559b683c-df91-46ea-bda7-2eac27cdacaf/tag/myTag',
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        }
    }
    let req = http.request(options, res => {});
    req.write(moment().format("DD/MM/YY-h:mm - ") + type + ': '+  text);
    req.end();
}

const log = {};
log.debug = function(text) {
    logger.debug(text);
    postToLoggly('debug', text);
}
log.info = function(text) {
    logger.info(text);
    postToLoggly('info', text);
}
log.warn = function(text) {
    logger.warn(text);
    postToLoggly('warn', text);
}
log.error = function(text) {
    logger.error(text);
    postToLoggly('error', text);
}

logger.level = 'debug';

module.exports.log = log;