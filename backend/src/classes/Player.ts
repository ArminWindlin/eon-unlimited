import Card from '../interfaces/card';

export default class Player {
    life: number;
    mana: number;
    actions: number;
    hand: Card[];
    board: Card[];
    socketId: string;
    name: string;
    selectedCard: number;

    constructor(socketId, name) {
        this.socketId = socketId;
        this.name = name;
        this.life = 40;
        this.mana = 20;
        this.actions = 15;
        this.board = [];
        this.hand = [];
        this.selectedCard = -1;
    }
}