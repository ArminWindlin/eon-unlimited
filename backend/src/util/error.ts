import * as winston from 'winston';
import {clientSocketMap, io} from '../socket';

export const logError = (error, file = 'unknown', method = 'unknown') => {
    console.log(`ERROR, File: ${file}, Method: ${method}, Message: ${error}`);
    errorLog.error(`ERROR, File: ${file}, Method: ${method}, Message: ${error}`);
};

export const sendError = (message, userName) => {
    io.to(clientSocketMap.get(userName)).emit('ERROR', message);
};

export const sendErrorToSocket = (message, socketId) => {
    io.to(socketId).emit('ERROR', message);
};

const errorLog = winston.createLogger({
    level: 'error',
    transports: [
        new winston.transports.File({filename: 'errors.log'}),
    ],
});