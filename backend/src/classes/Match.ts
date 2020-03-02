import Player from './Player';

export default class Match {
    player1: Player;
    player2: Player;
    started: boolean;

    constructor(player: Player) {
        this.player1 = player;
        this.started = false;
    }

    setPlayer2(player: Player) {
        this.player2 = player;
        this.started = true;
    }

    getPlayer(side: number): Player {
        return this[`player${side}`];
    }


}