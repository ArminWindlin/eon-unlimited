import {getRandomCard} from '../util/cardFunctions';
import {io, socketClientMap, socketGameMap} from '../socket';
import Player from '../classes/Player';
import Match from '../classes/Match';
import {addBot, removeBot} from './botC';
import {logError} from '../util/error';
import * as userC from './userC';
import {saveBotMatch} from './userC';
import {User} from '../model/user';

export const runningMatches: Map<number, Match> = new Map();
let currentMatchId = 0;
let playerWaiting = false;

// config
const MAX_ACTIONS = 20;

export const startMatch = (socketId) => {
    const name = socketClientMap.get(socketId);
    if (!playerWaiting || !runningMatches.has(currentMatchId) || runningMatches.get(currentMatchId).started) {
        const matchId = ++currentMatchId;
        runningMatches.set(matchId, new Match(new Player(socketId, name), matchId));
        playerWaiting = true;
        if (socketGameMap.has(socketId)) socketGameMap.delete(socketId);
        socketGameMap.set(socketId, matchId);
    } else {
        const match = runningMatches.get(currentMatchId);
        match.setPlayer2(new Player(socketId, name));
        playerWaiting = false;
        if (socketGameMap.has(socketId)) socketGameMap.delete(socketId);
        socketGameMap.set(socketId, currentMatchId);
        // match can start
        io.to(socketId).emit('MATCH_FOUND', {matchId: currentMatchId, opponent: match.player1.name});
        io.to(match.player1.socketId).emit('MATCH_FOUND', {matchId: currentMatchId, opponent: name});
        userC.joinMatch(match.player1.name, match.id);
        userC.joinMatch(name, match.id);
    }
};

export const startBotMatch = async (socketId) => {
    const name = socketClientMap.get(socketId);
    try {
        const user = (await User.findOne({name: name})).toObject();
        const matchId = ++currentMatchId;
        const match: Match = new Match(new Player(socketId, name), matchId);
        match.setPlayer2(addBot(matchId), true);
        if (user.activeBotMatch && user.botGameState && user.botGameState.player1) {
            // recover match
            const oldMatch = user.botGameState;
            oldMatch.player1.socketId = socketId;
            match.player1 = oldMatch.player1;
            oldMatch.player2.socketId = match.player2.socketId;
            oldMatch.player2.name = match.player2.name;
            match.player2 = oldMatch.player2;
        }
        runningMatches.set(matchId, match);
        socketGameMap.set(socketId, matchId);
        socketGameMap.set(match.player2.socketId, matchId);
        io.to(socketId).emit('MATCH_FOUND');
        userC.joinBotMatch(name);
    } catch (err) {
        userC.leaveBotMatch(name);
        logError(err, 'matchC', 'startBotMatch');
    }
};

export const reconnect = (socketId, userName, matchId) => {
    if (!runningMatches.has(matchId)) return false;
    const match = runningMatches.get(matchId);
    if (!match) return;
    socketGameMap.set(socketId, matchId);
    if (match.player1.name === userName) match.player1.socketId = socketId;
    else if (match.player2.name === userName) match.player2.socketId = socketId;
    else return false;
    return true;
};

export const disconnect = (socketId) => {
    const matchId = socketGameMap.get(socketId);
    if (!matchId) return;
    if (!runningMatches.has(matchId)) return;
    const match = runningMatches.get(matchId);
    if (!match.started) {
        runningMatches.delete(matchId);
    } else if (match.botMatch) {
        removeBot(match.player2.socketId);
        runningMatches.delete(matchId);
    }
};

export const surrender = (socketId, endBotGame = false) => {
    const matchId = socketGameMap.get(socketId);
    if (!matchId) return;
    if (!runningMatches.has(matchId)) return;
    const match = runningMatches.get(matchId);
    const opponent = match.getPlayer(getOpponentSide(match.getSideBySocket(socketId)));
    if (opponent)
        io.to(opponent.socketId).emit('MATCH_OVER', 'VICTORY (opponent surrendered)');
    if (match.botMatch) {
        removeBot(match.player2.socketId);
        if (endBotGame) userC.leaveBotMatch(socketClientMap.get(socketId));
    }
    runningMatches.delete(matchId);
};

export const drawCard = (socketId) => {
    const [match, side]: [Match, number] = getMatchAndSide(socketId);
    if (!match) return;
    if (!match.getPlayer(getOpponentSide(side)))
        return io.to(socketId).emit('SHOW_HINT', 'Wait for opponent');
    if (!changeActions(match, side, -1)) return;
    const player: Player = match.getPlayer(side);
    let hand = player.hand;
    if (hand.length > 3)
        return io.to(socketId).emit('SHOW_HINT', 'Hand is full');
    hand.push(getRandomCard(hand.length, side));
    io.to(socketId).emit('UPDATE_HAND', hand);
    changeLife(match, side, -1);
    if (match.botMatch && side === 1) saveBotMatch(player.name, match);
};

export const playCard = (socketId, cardIndex) => {
    const [match, side]: [Match, number] = getMatchAndSide(socketId);
    if (!match) return;
    const player: Player = match.getPlayer(side);
    let hand = player.hand;
    let board = player.board;
    if (hand.length < cardIndex + 1) return;
    let card = hand[cardIndex];

    if (board.length > 3)
        return io.to(socketId).emit('SHOW_HINT', 'Board is full');

    // remove actions
    if (!changeActions(match, side, -card.mana)) return;

    // set times
    card.protectedUntil = Date.now() + 5 * 1000;
    card.attackAt = Date.now();

    // remove card from hand
    hand.splice(cardIndex, 1);
    if (cardIndex !== hand.length) updateIndexes(hand);

    // add card to board
    card.index = board.length;
    card.place = 'board';
    board.push(card);

    io.to(socketId).emit('UPDATE_HAND', hand);
    sendBoardUpdate(match, side);
    if (match.botMatch && side === 1) saveBotMatch(player.name, match);
};

export const selectCard = (socketId, cardIndex, cardSide) => {
    const [match, side]: [Match, number] = getMatchAndSide(socketId);
    if (!match) return;
    const player: Player = match.getPlayer(side);
    let board = player.board;
    let selectedCard = player.selectedCard;
    let opponentSide = getOpponentSide(side);
    if (cardSide === side) {
        if (board.length < cardIndex + 1) return;
        // deselect previous select
        if (selectedCard > -1 && board[selectedCard]) board[selectedCard].selected = false;
        // select
        if (!board[cardIndex])
            return io.to(socketId).emit('SHOW_HINT', 'Card is gone');
        board[cardIndex].selected = true;
        player.selectedCard = cardIndex;
    } else {
        // run attack
        if (selectedCard === -1)
            return io.to(socketId).emit('SHOW_HINT', 'Select own card first');
        let card1 = board[selectedCard];
        if (!card1) return;
        if (card1.attackAt > Date.now())
            return io.to(socketId).emit('SHOW_HINT', 'Card is on cooldown');
        if (!changeActions(match, side, -1)) return;
        let opponentBoard = match.getPlayer(getOpponentSide(side)).board;
        if (opponentBoard.length < cardIndex + 1) return;
        let card2 = opponentBoard[cardIndex];
        if (card2.protectedUntil > Date.now())
            return io.to(socketId).emit('SHOW_HINT', 'Card is protected');
        if (!card1 || !card2) return;
        card2.health -= card1.offense;
        card1.health -= card2.defense;
        if (card2.health <= 0) {
            opponentBoard.splice(cardIndex, 1);
            if (cardIndex !== opponentBoard.length) updateIndexes(opponentBoard);
        }
        if (card1.health <= 0) {
            board.splice(selectedCard, 1);
            if (selectedCard !== board.length) updateIndexes(board);
        } else {
            card1.selected = false;
            card1.attackAt = Date.now() + 5 * 1000;
        }
        sendBoardUpdate(match, opponentSide);
        player.selectedCard = -1;
    }
    sendBoardUpdate(match, side);
};

export const attackPlayer = (socketId) => {
    const [match, side]: [Match, number] = getMatchAndSide(socketId);
    if (!match) return;
    const player: Player = match.getPlayer(side);
    let selectedCard = player.selectedCard;
    if (selectedCard === -1)
        return io.to(socketId).emit('SHOW_HINT', 'Select own card first');
    if (!player.board[selectedCard]) return;
    const card = player.board[selectedCard];
    if (card.attackAt > Date.now())
        return io.to(socketId).emit('SHOW_HINT', 'Card is on cooldown');
    if (!changeActions(match, side, -4)) return;
    changeLife(match, getOpponentSide(side), -player.board[selectedCard].offense);
    player.board[selectedCard].selected = false;
    player.selectedCard = -1;
    card.attackAt = Date.now() + 5 * 1000;
    sendBoardUpdate(match, side);
};

export const sendMessage = (socketId, message) => {
    const [match, side]: [Match, number] = getMatchAndSide(socketId);
    if (!match) return;
    let player = match.getPlayer(side);
    let opponent = match.getPlayer(getOpponentSide(side));
    io.to(opponent.socketId).emit('UPDATE_GAME_CHAT', {text: message, sender: player.name});
};

export const sendMatchData = (socketId) => {
    const [match, side]: [Match, number] = getMatchAndSide(socketId);
    if (!match) return;
    const player = match.getPlayer(side);
    const opponent = match.getPlayer(getOpponentSide(side));
    io.to(socketId).emit('UPDATE_HAND', player.hand);
    io.to(socketId).emit('UPDATE_BOARD', player.board);
    io.to(socketId).emit('UPDATE_ENEMY_BOARD', opponent.board);
    io.to(socketId).emit('UPDATE_LIFE', player.life);
    io.to(socketId).emit('UPDATE_ENEMY_LIFE', opponent.life);
    io.to(socketId).emit('UPDATE_MANA', player.mana);
    io.to(socketId).emit('UPDATE_ENEMY_MANA', opponent.mana);
    io.to(socketId).emit('UPDATE_ACTIONS', player.actions);
    io.to(socketId).emit('UPDATE_ENEMY_ACTIONS', opponent.actions);
    io.to(socketId).emit('UPDATE_MATCH', {matchId: match.id, opponent: opponent.name, isBotMatch: match.botMatch});
};

const changeActions = (match: Match, side, amount) => {
    const player = match.getPlayer(side);
    if (amount < 0 && player.actions + amount < 0) {
        io.to(player.socketId).emit('SHOW_HINT', 'Not enough actions');
        return false;
    }
    if (amount > 0 && player.actions >= MAX_ACTIONS) return;
    player.actions += amount;
    const actions = player.actions;
    io.to(player.socketId).emit('UPDATE_ACTIONS', actions);
    io.to(match.getPlayer(getOpponentSide(side)).socketId).emit('UPDATE_ENEMY_ACTIONS', actions);
    return true;
};

const changeLife = (match, side, amount) => {
    const player = match.getPlayer(side);
    player.life += amount;
    const life = player.life;
    io.to(player.socketId).emit('UPDATE_LIFE', life);
    io.to(match.getPlayer(getOpponentSide(side)).socketId).emit('UPDATE_ENEMY_LIFE', life);
    if (life <= 0) {
        // match over
        io.to(player.socketId).emit('MATCH_OVER', 'DEFEAT');
        io.to(match.getPlayer(getOpponentSide(side)).socketId).emit('MATCH_OVER', 'VICTORY');
        runningMatches.delete(match.id);
        if (match.botMatch) {
            removeBot(match.player2.socketId);
            userC.leaveBotMatch(match.player1.name);
        } else {
            userC.leaveMatch(match.player1.name);
            userC.leaveMatch(match.player2.name);
        }
    }
};

const getMatchAndSide = (socketId): [Match, number] => {
    const matchId = socketGameMap.get(socketId);
    if (!runningMatches.has(matchId)) {
        logError(Error(`No match with matchId ${matchId}`), 'matchC', 'getMatchAndSide');
        return [null, -1];
    }
    const match = runningMatches.get(matchId);
    const side = match.getSideBySocket(socketId);
    return [match, side];
};

const updateIndexes = (cardContainer) => {
    cardContainer.forEach((c, i) => {
        c.index = i;
    });
};

export const getOpponentSide = (side) => {
    return side === 1 ? 2 : 1;
};

const sendBoardUpdate = (match, side) => {
    const player = match.getPlayer(side);
    const board = player.board;
    io.to(player.socketId).emit('UPDATE_BOARD', board);
    io.to(match.getPlayer(getOpponentSide(side)).socketId).emit('UPDATE_ENEMY_BOARD', board);
};

// action and mana beat
// TODO: move to different file
setInterval(() => {
    runningMatches.forEach(m => {
        if (m.started) {
            changeActions(m, 1, 2);
            changeActions(m, 2, 2);
        }
    });
}, 1000 * 4);
