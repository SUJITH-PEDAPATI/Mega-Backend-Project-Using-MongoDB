import { createLogger, format, transports} from 'winston';

const {combine,timestamp,json,colorize} = format;

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
    format.colorize(),
    format.printf(({level,message,timestamp}) => {
        return `${level}: ${message}`;
    })
);

// Creating a Winston Logger
const logger = createLogger({
    level: 'info',
    format: combine(
        colorize(),
        timestamp(),
        json()
    ),
    transports: [ //define how should I use the transported information
        new transports.Console({ // Overwiriting the console
            format: consoleLogFormat
        }),
        new transports.File({ filename: 'app.log'}) // store the file in the 'app.log'
    ],
});

export default logger;