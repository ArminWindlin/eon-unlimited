import * as socketio from 'socket.io';
import * as matchC from './controller/matchC';
import {User} from './model/user';
import {sendErrorToSocket} from './util/error';
import {addUser} from './controller/userC';

export let io;
export const clientSocketMap = new Map();
export const socketClientMap = new Map();
const socketGameMap = new Map();

export function setupWebSockets(server) {
    io = socketio(server, {transports: ['websocket', 'polling']});

    io.on('connection', (socket) => {

        // AUTHENTICATION
        socket.on('REGISTER', async function(data) {
            addUser(data, socket.id);
        });

        socket.on('CONNECT_USER', async function(data) {
            let userR = await User.findOne({token: data});
            if (userR === null) {
                socket.emit('CONNECT_ERROR');
                sendErrorToSocket('socket connection error: invalid token', socket.id);
                return;
            }
            let userName = userR.toObject().name;
            clientSocketMap.set(userName, socket.id);
            socketClientMap.set(socket.id, userName);
            socket.emit('CONNECT_SUCCESS');
        });

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

        socket.on('ACTION_ATTACK_PLAYER', (data) => {
            if (socketGameMap.has(socket.id))
                matchC.attackPlayer(socketGameMap.get(socket.id), socket.id);
        });

        // OTHER
        socket.on('SELECT_CARD', (data) => {
            if (socketGameMap.has(socket.id))
                matchC.selectCard(socketGameMap.get(socket.id), socket.id, data.index, data.side);
        });

    });

}