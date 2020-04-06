import Player from './Player';

export default class Bot extends Player {
    matchId: number;

    constructor(botId, matchId) {
        super(botId, 'bot_' + botId);
        this.matchId = matchId;
    }
}
