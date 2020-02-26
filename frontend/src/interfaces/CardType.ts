export default interface CardType {
    id: number,
    title: string,
    // stats
    offense: number,
    defense: number,
    health: number,
    mana: number,
    // usability
    selected: boolean,
    index: number,
    place: string,
    side: number
}