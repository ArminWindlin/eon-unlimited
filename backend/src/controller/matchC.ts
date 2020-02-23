import {getRandomCard} from '../util/cardFunctions';
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
        };
        return '1_' + currentMatchId;
    } else {
        runningMatches[currentMatchId] = {
            player2: socketId,
        };
        playerWaiting = false;
        return '2_' + currentMatchId;
    }
};

export const drawCard = (extendedMatchId, socketId) => {
    const [position, matchID] = extendedMatchId.split('_');
    let match = runningMatches[matchID];
    let hand = match[`hand${position}`];
    if (hand.length > 3)
        return io.to(socketId).emit('SHOW_HINT', 'Hand is full');
    hand.push(getRandomCard(hand.length));
    match[`hand${position}`] = hand;
    io.to(socketId).emit('UPDATE_HAND', hand);
};

export const playCard = (extendedMatchId, socketId, cardIndex) => {
    const [position, matchID] = extendedMatchId.split('_');
    let match = runningMatches[matchID];
    let hand = match[`hand${position}`];
    let board = match[`board${position}`];

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
    board.push(card);

    match[`hand${position}`] = hand;
    match[`board${position}`] = board;
    io.to(socketId).emit('UPDATE_HAND', hand);
    io.to(socketId).emit('UPDATE_BOARD', board);
};

