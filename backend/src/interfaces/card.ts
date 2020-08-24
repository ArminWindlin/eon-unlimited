export default interface Card {
    id: string,
    name: string,
    image: string,
    // stats
    offense: number,
    defense: number,
    health: number,
    mana: number,
    // classification
    type: string,
    rarity: string,
    class: string,
    // usability
    selected: boolean,
    index: number,
    place: string,
    side: number,
    protectedUntil?: number,
    attackAt?: number,
};

export interface CardMin {
    id: string,
    name: string,
    image: string,
    // stats
    offense: number,
    defense: number,
    health: number,
    mana: number,
};