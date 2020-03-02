import Card from '../interfaces/card';

export default class Player {
    life: number;
    mana: number;
    actions: number;
    hand: Card[];
    board: Card[];
    socketId: string;
    selectedCard: number;

    constructor(socketId) {
        this.socketId = socketId;
        this.life = 100;
        this.mana = 20;
        this.actions = 6;
        this.board = [];
        this.hand = [];
        this.selectedCard = -1;
    }
}