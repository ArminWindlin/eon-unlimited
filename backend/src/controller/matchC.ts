import {getRandomCard} from '../util/cardFunctions';
import {io} from '../socket';
import Match from '../interfaces/match';

const runningMatches: Match[] = [];
let currentMatchId = -1;
let playerWaiting = false;

// config
const MAX_ACTIONS = 10;
const MAX_MANA = 20;

export const startMatch = (socketId) => {
    if (!playerWaiting) {
        runningMatches[++currentMatchId] = {
            player1: socketId,
            hand1: [],
            board1: [],
            selectedCard1: -1,
            life1: 100,
            mana1: 20,
            actions1: 6,
        };
        playerWaiting = true;
        return '1_' + currentMatchId;
    } else {
        let match = runningMatches[currentMatchId];
        match.player2 = socketId;
        match.hand2 = [];
        match.board2 = [];
        match.selectedCard2 = -1;
        match.life2 = 100;
        match.mana2 = 20;
        match.actions2 = 6;
        playerWaiting = false;
        return '2_' + currentMatchId;
    }
};

export const drawCard = (extendedMatchId, socketId) => {
    const [match, side] = getMatchAndSide(extendedMatchId);
    if (!changeActions(match, side, -1)) return;
    let hand = match[`hand${side}`];
    if (hand.length > 3)
        return io.to(socketId).emit('SHOW_HINT', 'Hand is full');
    hand.push(getRandomCard(hand.length, side));
    match[`hand${side}`] = hand;
    io.to(socketId).emit('UPDATE_HAND', hand);
    changeLife(match, side, -1);
};

export const playCard = (extendedMatchId, socketId, cardIndex) => {
    const [match, side] = getMatchAndSide(extendedMatchId);
    if (!changeActions(match, side, -1)) return;
    let hand = match[`hand${side}`];
    let board = match[`board${side}`];
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

    match[`hand${side}`] = hand;
    match[`board${side}`] = board;
    io.to(socketId).emit('UPDATE_HAND', hand);
    sendBoardUpdate(match, side);
};

export const selectCard = (extendedMatchId, socketId, cardIndex, cardSide) => {
    const [match, side] = getMatchAndSide(extendedMatchId);
    let board = match[`board${side}`];
    let selectedCard = match[`selectedCard${side}`];
    let enemySide = getEnemySide(side);
    if (cardSide === side) {
        // deselect previous select
        if (selectedCard > -1) board[selectedCard].selected = false;
        // select
        if (!board[cardIndex])
            return io.to(socketId).emit('SHOW_HINT', 'Card is gone');
        board[cardIndex].selected = true;
        match[`selectedCard${side}`] = cardIndex;
    } else {
        if (selectedCard === -1)
            return io.to(socketId).emit('SHOW_HINT', 'Select own card first');
        // run attack
        if (!changeActions(match, side, -1)) return;
        let enemyBoard = match[`board${enemySide}`];
        let card1 = board[selectedCard];
        let card2 = enemyBoard[cardIndex];
        card2.health -= card1.offense;
        card1.health -= card2.defense;
        if (card2.health <= 0) {
            enemyBoard.splice(cardIndex, 1);
            if (cardIndex !== enemyBoard.length) updateIndexes(enemyBoard);
        }
        if (card1.health <= 0) {
            board.splice(selectedCard, 1);
            if (selectedCard !== board.length) updateIndexes(board);
        } else card1.selected = false;
        sendBoardUpdate(match, enemySide);
        match[`selectedCard${side}`] = -1;
    }
    match[`board${side}`] = board;
    sendBoardUpdate(match, side);
};

export const attackPlayer = (extendedMatchId, socketId) => {
    const [match, side] = getMatchAndSide(extendedMatchId);
    if (!changeActions(match, side, -2)) return;
    let selectedCard = match[`selectedCard${side}`];
    if (selectedCard === -1)
        return io.to(socketId).emit('SHOW_HINT', 'Select own card first');
    changeLife(match, getEnemySide(side), -match[`board${side}`][selectedCard].offense);
    match[`board${side}`][selectedCard].selected = false;
    match[`selectedCard${side}`] = -1;
    sendBoardUpdate(match, side);
};

const changeActions = (match, side, amount) => {
    if (amount < 0 && match[`actions${side}`] + amount < 0) {
        io.to(match[`player${side}`]).emit('SHOW_HINT', 'Not enough actions');
        return false;
    }
    if (amount > 0 && match[`actions${side}`] >= MAX_ACTIONS) return;
    match[`actions${side}`] += amount;
    const actions = match[`actions${side}`];
    io.to(match[`player${side}`]).emit('UPDATE_ACTIONS', actions);
    io.to(match[`player${getEnemySide(side)}`]).emit('UPDATE_ENEMY_ACTIONS', actions);
    return true;
};

const changeMana = (match, side, amount) => {
    if (amount < 0 && match[`mana${side}`] + amount < 0) {
        io.to(match[`player${side}`]).emit('SHOW_HINT', 'Not enough mana');
        return false;
    }
    if (amount > 0 && match[`mana${side}`] >= MAX_MANA) return;
    match[`mana${side}`] += amount;
    const mana = match[`mana${side}`];
    io.to(match[`player${side}`]).emit('UPDATE_MANA', mana);
    io.to(match[`player${getEnemySide(side)}`]).emit('UPDATE_ENEMY_MANA', mana);
    return true;
};

const changeLife = (match, side, amount) => {
    match[`life${side}`] += amount;
    const life = match[`life${side}`];
    io.to(match[`player${side}`]).emit('UPDATE_LIFE', life);
    io.to(match[`player${getEnemySide(side)}`]).emit('UPDATE_ENEMY_LIFE', life);
};

const getMatchAndSide = (extendedMatchId) => {
    const [side, matchID] = extendedMatchId.split('_').map(x => Number(x));
    return [runningMatches[matchID], side];
};

const updateIndexes = (cardContainer) => {
    cardContainer.forEach((c, i) => {
        c.index = i;
    });
};

const getEnemySide = (side) => {
    return side === 1 ? 2 : 1;
};

const sendBoardUpdate = (match, side) => {
    const board = match[`board${side}`];
    io.to(match[`player${side}`]).emit('UPDATE_BOARD', board);
    io.to(match[`player${getEnemySide(side)}`]).emit('UPDATE_ENEMY_BOARD', board);
};

// action and mana beat
// TODO: move to different file
setInterval(() => {
    runningMatches.forEach(m => {
        changeActions(m, 1, 1);
        changeActions(m, 2, 1);
        changeMana(m, 1, 1);
        changeMana(m, 2, 1);
    });
}, 1000 * 5);
