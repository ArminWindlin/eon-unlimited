import Card from './card';

export default interface Match {
    // player 1
    player1: string,
    hand1: Card[],
    board1: Card[],
    selectedCard1: number,
    life1: number,
    mana1: number,
    actions1: number,
    // player 2
    player2?: string,
    hand2?: Card[],
    board2?: Card[],
    selectedCard2?: number,
    life2?: number,
    mana2?: number,
    actions2?: number
};