import Player from './Player';

export default class Match {
    id: number;
    player1: Player;
    player2: Player;
    started: boolean;
    botMatch: boolean;

    constructor(player: Player, matchId) {
        this.player1 = player;
        this.started = false;
        this.id = matchId;
    }

    setPlayer2(player: Player, isBot = false) {
        this.player2 = player;
        this.started = true;
        this.botMatch = isBot;
    }

    getPlayer(side: number): Player {
        return this[`player${side}`];
    }

    getSideBySocket(socketId: string): number {
        return this.player1.socketId === socketId ? 1 : 2;
    }

}