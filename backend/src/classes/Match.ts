import Player from './Player';

export default class Match {
    player1: Player;
    player2: Player;
    started: boolean;
    closed: boolean;

    constructor(player: Player) {
        this.player1 = player;
        this.started = false;
        this.closed = false;
    }

    setPlayer2(player: Player) {
        this.player2 = player;
        this.started = true;
    }

    getPlayer(side: number): Player {
        return this[`player${side}`];
    }

    getSideBySocket(socketId: string): number {
        return this.player1.socketId === socketId ? 1 : 2;
    }

}