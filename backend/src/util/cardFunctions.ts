import Card from '../interfaces/card';

export const getRandomCards = (amount) => {
    let cards = [];
    for (let i = 0; i < amount; i++) {
        cards.push(getRandomCard(i));
    }
    return cards;
};

export const getRandomCard = (index = -1, side = 1) => {
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
        'Giant Tree',
    ];
    let card: Card = {
        id: Math.floor(Math.random() * 10000),
        title: names[Math.floor(Math.random() * names.length)],
        offense: Math.floor(Math.random() * 10 + 10),
        defense: Math.floor(Math.random() * 10),
        health: Math.floor(Math.random() * 20 + 1),
        mana: Math.floor(Math.random() * 10 + 5),
        selected: false,
        index: index,
        place: 'hand',
        side: side,
    };
    return card;
};