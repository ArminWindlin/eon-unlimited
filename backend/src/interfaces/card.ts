export default interface Card {
    id: number,
    title: string,
    offense: number,
    defense: number,
    health: number,
    mana: number,
    selected: boolean,
    index: number,
    place: string,
    side: number
};