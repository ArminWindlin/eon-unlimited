import {getRandomCard} from '../util/cardFunctions';
import {io, socketClientMap, socketGameMap} from '../socket';
import Player from '../classes/Player';
import Match from '../classes/Match';

export const runningMatches: Match[] = [];
let currentMatchId = 0;
let playerWaiting = false;

// config
const MAX_ACTIONS = 10;
const MAX_MANA = 20;

export const startMatch = (socketId) => {
    const name = socketClientMap.get(socketId);
    if (!playerWaiting || runningMatches[currentMatchId].closed) {
        runningMatches[++currentMatchId] = new Match(new Player(socketId, name));
        playerWaiting = true;
        if (socketGameMap.has(socketId)) socketGameMap.delete(socketId);
        socketGameMap.set(socketId, currentMatchId);
    } else {
        let match = runningMatches[currentMatchId];
        match.setPlayer2(new Player(socketId, name));
        playerWaiting = false;
        if (socketGameMap.has(socketId)) socketGameMap.delete(socketId);
        socketGameMap.set(socketId, currentMatchId);
        // match can start
        io.to(socketId).emit('MATCH_FOUND', {matchId: currentMatchId, opponent: match.player1.name});
        io.to(match.player1.socketId).emit('MATCH_FOUND', {matchId: currentMatchId, opponent: name});
    }
};

export const disconnect = (socketId) => {
    const matchId = socketGameMap.get(socketId);
    if (!matchId) return;
    const match = runningMatches[matchId];
    match.closed = true;
    const opponent = match.getPlayer(getOpponentSide(match.getSideBySocket(socketId)));
    if (opponent)
        io.to(opponent.socketId).emit('MATCH_OVER', 'VICTORY (opponent disconnected)');
};

export const drawCard = (socketId) => {
    const [match, side]: [Match, number] = getMatchAndSide(socketId);
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
};

export const playCard = (socketId, cardIndex) => {
    const [match, side]: [Match, number] = getMatchAndSide(socketId);
    if (!changeActions(match, side, -1)) return;
    const player: Player = match.getPlayer(side);
    let hand = player.hand;
    let board = player.board;
    let card = hand[cardIndex];

    if (board.length > 3)
        return io.to(socketId).emit('SHOW_HINT', 'Board is full');

    // remove mana
    if (!changeMana(match, side, -card.mana)) return;

    // remove card from hand
    hand.splice(cardIndex, 1);
    if (cardIndex !== hand.length) updateIndexes(hand);

    // add card to board
    card.index = board.length;
    card.place = 'board';
    board.push(card);

    io.to(socketId).emit('UPDATE_HAND', hand);
    sendBoardUpdate(match, side);
};

export const selectCard = (socketId, cardIndex, cardSide) => {
    const [match, side]: [Match, number] = getMatchAndSide(socketId);
    const player: Player = match.getPlayer(side);
    let board = player.board;
    let selectedCard = player.selectedCard;
    let opponentSide = getOpponentSide(side);
    if (cardSide === side) {
        // deselect previous select
        if (selectedCard > -1) board[selectedCard].selected = false;
        // select
        if (!board[cardIndex])
            return io.to(socketId).emit('SHOW_HINT', 'Card is gone');
        board[cardIndex].selected = true;
        player.selectedCard = cardIndex;
    } else {
        if (selectedCard === -1)
            return io.to(socketId).emit('SHOW_HINT', 'Select own card first');
        // run attack
        if (!changeActions(match, side, -1)) return;
        let opponentBoard = match.getPlayer(getOpponentSide(side)).board;
        let card1 = board[selectedCard];
        let card2 = opponentBoard[cardIndex];
        card2.health -= card1.offense;
        card1.health -= card2.defense;
        if (card2.health <= 0) {
            opponentBoard.splice(cardIndex, 1);
            if (cardIndex !== opponentBoard.length) updateIndexes(opponentBoard);
        }
        if (card1.health <= 0) {
            board.splice(selectedCard, 1);
            if (selectedCard !== board.length) updateIndexes(board);
        } else card1.selected = false;
        sendBoardUpdate(match, opponentSide);
        player.selectedCard = -1;
    }
    sendBoardUpdate(match, side);
};

export const attackPlayer = (socketId) => {
    const [match, side]: [Match, number] = getMatchAndSide(socketId);
    if (!changeActions(match, side, -4)) return;
    const player: Player = match.getPlayer(side);
    let selectedCard = player.selectedCard;
    if (selectedCard === -1)
        return io.to(socketId).emit('SHOW_HINT', 'Select own card first');
    changeLife(match, getOpponentSide(side), -player.board[selectedCard].offense);
    player.board[selectedCard].selected = false;
    player.selectedCard = -1;
    sendBoardUpdate(match, side);
};

export const sendMessage = (socketId, message) => {
    const [match, side]: [Match, number] = getMatchAndSide(socketId);
    let player = match.getPlayer(side);
    let opponent = match.getPlayer(getOpponentSide(side));
    io.to(opponent.socketId).emit('UPDATE_GAME_CHAT', {text: message, sender: player.name});
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

const changeMana = (match, side, amount) => {
    const player = match.getPlayer(side);
    if (amount < 0 && player.mana + amount < 0) {
        io.to(player.socketId).emit('SHOW_HINT', 'Not enough mana');
        return false;
    }
    if (amount > 0 && player.mana >= MAX_MANA) return;
    player.mana += amount;
    const mana = player.mana;
    io.to(player.socketId).emit('UPDATE_MANA', mana);
    io.to(match.getPlayer(getOpponentSide(side)).socketId).emit('UPDATE_ENEMY_MANA', mana);
    return true;
};

const changeLife = (match, side, amount) => {
    const player = match.getPlayer(side);
    player.life += amount;
    const life = player.life;
    io.to(player.socketId).emit('UPDATE_LIFE', life);
    io.to(match.getPlayer(getOpponentSide(side)).socketId).emit('UPDATE_ENEMY_LIFE', life);
    if (life <= 0) {
        io.to(player.socketId).emit('MATCH_OVER', 'DEFEAT');
        io.to(match.getPlayer(getOpponentSide(side)).socketId).emit('MATCH_OVER', 'VICTORY');
    }
};

const getMatchAndSide = (socketId): [Match, number] => {
    const matchId = socketGameMap.get(socketId);
    const match = runningMatches[matchId];
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
            changeActions(m, 1, 1);
            changeActions(m, 2, 1);
        }
    });
}, 1000 * 5);

setInterval(() => {
    runningMatches.forEach(m => {
        if (m.started) {
            changeMana(m, 1, 1);
            changeMana(m, 2, 1);
        }
    });
}, 1000 * 8);
