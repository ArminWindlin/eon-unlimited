import * as socketio from 'socket.io';
import * as matchC from './controller/matchC';
import {User} from './model/user';
import {sendErrorToSocket} from './util/error';
import * as userC from './controller/userC';

export let io;
export const clientSocketMap = new Map();
export const socketClientMap = new Map();
export const socketGameMap = new Map();

export function setupWebSockets(server) {
    io = socketio(server, {transports: ['websocket', 'polling']});

    io.on('connection', (socket) => {

        // AUTHENTICATION
        socket.on('REGISTER', async function(data) {
            userC.addUser(data, socket.id);
        });

        socket.on('LOGIN', async function(data) {
            userC.login(data.userName, data.password, socket.id);
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
            socket.emit('CONNECT_SUCCESS', userName);
        });

        socket.on('disconnect', () => {
            if (socketClientMap.has(socket.id)) {
                matchC.disconnect(socket.id);
                clientSocketMap.delete(socketClientMap.get(socket.id));
                socketClientMap.delete(socket.id);
            }
        });

        // CHAT
        socket.on('POST_GAME_CHAT', (data) => {
            matchC.sendMessage(socket.id, data);
        });

        // MATCHMAKING
        socket.on('MATCH_SEARCH', () => {
            matchC.startMatch(socket.id);
        });

        // ACTIONS
        socket.on('ACTION_DRAW', () => {
            matchC.drawCard(socket.id);
        });

        socket.on('ACTION_PLAY', (data) => {
            matchC.playCard(socket.id, data);
        });

        socket.on('ACTION_ATTACK_PLAYER', () => {
            matchC.attackPlayer(socket.id);
        });

        // OTHER
        socket.on('SELECT_CARD', (data) => {
            matchC.selectCard(socket.id, data.index, data.side);
        });

    });

}