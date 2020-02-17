import * as socketio from 'socket.io';

export let io;

export function setupWebSockets(server) {
    io = socketio(server);

    io.on('connection', (socket) => {

        // POST requests
        socket.on('POST_GLOBAL_MESSAGE', (data) => {
            socket.broadcast.emit('UPDATE_GLOBAL_MESSAGES', data);
        });

    });

}