import CardType from '../interfaces/CardType';

export const getRandomCards: (amount: number) => CardType[] = (amount) => {
    let cards: CardType[] = [];
    for (let i = 0; i < amount; i++) {
        cards.push(getRandomCard());
    }
    return cards;
};

export const getRandomCard: () => CardType = () => {
    const names: string[] = [
        'Dragon',
        'Heimer',
        'Fairy',
        'Heist',
        'Mouse',
        'Eagle',
        'Lucifer',
        'Lord',
        'Demonic Pact',
        'Flash',
        'Dungo',
        'Giant Tree'
    ];
    return {
        id: Math.floor(Math.random() * 1000),
        title: names[Math.floor(Math.random() * names.length)],
        offense: Math.floor(Math.random() * 20),
        defense: Math.floor(Math.random() * 20),
        health: Math.floor(Math.random() * 20) + 1,
        mana: Math.floor(Math.random() * 10),
    };
};