import Bot from '../classes/Bot';
import * as matchC from './matchC';
import {logError} from '../util/error';

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
    bots.forEach(b => {
        const random = Math.random();
        const match = matchC.runningMatches.get(b.matchId);
        if (!match)
            return logError(Error('Match not found'), 'botC', 'setInterval');
        if (random < 0.3)
            matchC.drawCard(b.socketId);
        else if (random < 0.7)
            matchC.playCard(b.socketId, 0);
        else {
            matchC.selectCard(b.socketId, 0, 2);
            setTimeout(() => {
                matchC.selectCard(b.socketId, 0, 1);
            }, 1000);
        }
    });
}, 1000 * 5);
