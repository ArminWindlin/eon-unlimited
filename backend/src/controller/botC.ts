import Bot from '../classes/Bot';
import * as matchC from './matchC';
import {logError} from '../util/error';
import Card from '../interfaces/card';

const bots: Map<number, Bot> = new Map();
let currentBotId = 0;

export const addBot = (matchId) => {
    const bot = new Bot(++currentBotId, matchId);
    bots.set(currentBotId, bot);
    return bot;
};

export const removeBot = (botID) => {
    bots.delete(botID);
};

setInterval(() => {
    bots.forEach(bot => {
        const match = matchC.runningMatches.get(bot.matchId);
        if (!match)
            return logError(Error('Match not found'), 'botC', 'setInterval');
        const hand = match.player2.hand;
        const board = match.player2.board;
        if (hand.length < 3)
            matchC.drawCard(bot.socketId);
        else if (!canAttack(board)) {
            playCard(bot, hand);
        } else {
            const enemy = match.player1;
            const enemyBoard = enemy.board;
            if (!enemyBoard.length || enemy.life <= 10) attackPlayer(bot, board);
            attackCard(bot, board, enemyBoard);
        }
    });
}, 1000 * 3);

const playCard = (bot, hand) => {
    matchC.playCard(bot.socketId, Math.floor(Math.random() * hand.length));
};

const attackPlayer = (bot, board: Card[]) => {
    // Attacks player with the card that has the highest attack
    let cardIndex = 0;
    let highestOffense = 0;
    board.forEach((card, i) => {
        if (cardCanAttack(card) && card.offense > highestOffense) {
            cardIndex = i;
            highestOffense = card.offense;
        }
    });
    matchC.selectCard(bot.socketId, cardIndex, 2);
    setTimeout(() => {
        matchC.attackPlayer(bot.socketId);
    }, 800);
};

const attackCard = (bot, board: Card[], enemyBoard: Card[]) => {
    // Determine card with highest attack
    let cardIndex = 0;
    let highestOffense = 0;
    board.forEach((card, i) => {
        if (cardCanAttack(card) && card.offense > highestOffense) {
            cardIndex = i;
            highestOffense = card.offense;
        }
    });
    // Determine enemy card with highest attack that is lower then highestAttack of bots card, if possible
    let enemyCardIndex = 0;
    let enemyOffense = 0;
    enemyBoard.forEach((card, i) => {
        if (cardIsAttackable(card) &&
            (enemyOffense === 0 || (card.offense > enemyOffense && card.offense <= highestOffense))) {
            enemyCardIndex = i;
            enemyOffense = card.offense;
        }
    });
    matchC.selectCard(bot.socketId, cardIndex, 2);
    setTimeout(() => {
        matchC.selectCard(bot.socketId, 0, 1);
    }, 1000);
};

const canAttack = (cards: Card[]) => {
    let canAttack = false;
    cards.forEach(card => {
        if (cardCanAttack(card)) canAttack = true;
    });
    return canAttack;
};

const cardCanAttack = (card: Card) => {
    return card.attackAt < Date.now();
};

const cardIsAttackable = (card: Card) => {
    return card.protectedUntil < Date.now();
};
