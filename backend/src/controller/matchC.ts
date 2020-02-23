import {getRandomCard, getRandomCards} from '../util/cardFunctions';
import {io} from '../socket';

const runningMatches = [];
let currentMatchId = -1;
let playerWaiting = false;

export const startMatch = (socketId) => {
    if (!playerWaiting) {
        runningMatches[++currentMatchId] = {
            player1: socketId,
            hand1: [],
            board1: [],
            selectedCard1: -1,
        };
        return '1_' + currentMatchId;
    } else {
        runningMatches[currentMatchId] = {
            player2: socketId,
            hand2: [],
            board2: [],
            selectedCard2: -1,
        };
        playerWaiting = false;
        return '2_' + currentMatchId;
    }
};

export const drawCard = (extendedMatchId, socketId) => {
    const [side, matchID] = extendedMatchId.split('_');
    const match = runningMatches[matchID];
    let hand = match[`hand${side}`];
    if (hand.length > 3)
        return io.to(socketId).emit('SHOW_HINT', 'Hand is full');
    hand.push(getRandomCard(hand.length));
    match[`hand${side}`] = hand;
    io.to(socketId).emit('UPDATE_HAND', hand);
};

export const playCard = (extendedMatchId, socketId, cardIndex) => {
    const [side, matchID] = extendedMatchId.split('_');
    const match = runningMatches[matchID];
    let hand = match[`hand${side}`];
    let board = match[`board${side}`];

    // remove card from hand
    let card = hand[cardIndex];
    hand.splice(cardIndex, 1);

    // adjust hand card indexes
    if (cardIndex !== hand.length)
        hand.forEach((c, i) => {
            c.index = i;
        });

    // add card to board
    card.index = board.length;
    card.position = 'board';
    board.push(card);

    match[`hand${side}`] = hand;
    match[`board${side}`] = board;
    io.to(socketId).emit('UPDATE_HAND', hand);
    io.to(socketId).emit('UPDATE_BOARD', board);
};

export const selectCard = (extendedMatchId, socketId, cardIndex, cardPosition) => {
    const [side, matchID] = extendedMatchId.split('_');
    const match = runningMatches[matchID];
    let board = match[`board${side}`];
    let selectedCard = match[`selectedCard${side}`];
    if (cardPosition === 'board') {
        // deselect previous select
        if (selectedCard > -1) board[selectedCard].selected = false;
        // select
        board[cardIndex].selected = true;
        match[`selectedCard${side}`] = cardIndex;
    } else {
        if (selectedCard === -1)
            return io.to(socketId).emit('SHOW_HINT', 'Select own card first');
        let enemySide = side === 1 ? 2 : 1;
        let enemyBoard = match[`enemyBoard${enemySide}`];
        enemyBoard.splice(cardIndex, 1);
        board.splice(selectedCard, 1);
        io.to(socketId).emit('UPDATE_ENEMY_BOARD', enemyBoard);
        match[`selectedCard${side}`] = -1;
    }
    match[`board${side}`] = board;
    io.to(socketId).emit('UPDATE_BOARD', board);
};


