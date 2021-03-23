import {
    createLogger,
    transports,
    format
} from 'winston';
const logger = createLogger({
    transports: [
        new transports.File({
            filename: 'config/info.log',
            level: 'info',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
})

module.exports = logger;