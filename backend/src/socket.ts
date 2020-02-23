import * as socketio from 'socket.io';
import * as matchC from './controller/matchC';

export let io;
const socketGameMap = new Map();

export function setupWebSockets(server) {
    io = socketio(server);

    io.on('connection', (socket) => {

        // CHAT
        socket.on('POST_GLOBAL_MESSAGE', (data) => {
            socket.broadcast.emit('UPDATE_GLOBAL_MESSAGES', data);
        });

        // MATCHMAKING
        socket.on('MATCH_SEARCH', () => {
            let extendedMatchId = matchC.startMatch(socket.id);
            socketGameMap.set(socket.id, extendedMatchId);
            socket.emit('MATCH_FOUND', extendedMatchId);
        });

        // ACTIONS
        socket.on('ACTION_DRAW', () => {
            if (socketGameMap.has(socket.id))
                matchC.drawCard(socketGameMap.get(socket.id), socket.id);
        });

        socket.on('ACTION_PLAY', (data) => {
            if (socketGameMap.has(socket.id))
                matchC.playCard(socketGameMap.get(socket.id), socket.id, data);
        });

    });

}