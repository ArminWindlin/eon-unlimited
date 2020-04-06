import Bot from '../classes/Bot';
import * as matchC from './matchC';

const bots: Map<number, Bot> = new Map();
let currentBotId = 0;

export const addBot = (matchId) => {
    const bot = new Bot(++currentBotId, matchId);
    bots.set(currentBotId, bot);
    return bot;
};

setInterval(() => {
    bots.forEach(b => {
        const random = Math.random();
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
