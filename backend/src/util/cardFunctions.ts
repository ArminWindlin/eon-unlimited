import Card, {CardMin} from '../interfaces/card';
import {units as commonCards} from '../cards/neutral/common';
import {units as rareCards} from '../cards/neutral/rare';
import {units as epicCards} from '../cards/neutral/epic';
import {units as legendaryCards} from '../cards/neutral/legendary';

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
    let rarity;
    const randomRarity = Math.random();
    if (randomRarity < 0.08) rarity = 'legendary';
    else if (randomRarity < 0.2) rarity = 'epic';
    else if (randomRarity < 0.4) rarity = 'rare';
    else rarity = 'common';
    let cardMin: CardMin = getRandomNeutral(rarity);
    let card: Card = Object.assign({
        type: 'unit',
        rarity: rarity,
        class: 'neutral',
        selected: false,
        index: index,
        place: 'hand',
        side: side,
    }, cardMin);
    return card;
};

function getRandomNeutral(rarity) {
    switch (rarity) {
        case 'common':
            return commonCards[Math.floor(Math.random() * commonCards.length)];
        case 'rare':
            return rareCards[Math.floor(Math.random() * rareCards.length)];
        case 'epic':
            return epicCards[Math.floor(Math.random() * epicCards.length)];
        case 'legendary':
            return legendaryCards[Math.floor(Math.random() * legendaryCards.length)];
        default:
            throw Error('invalid rarity');
    }
}

// Returns random stats according to stat-strength-formula
// To use separately take file eon-unlimited/utility/statsGenerator.js
function getRandomStats(rarity) {
    let manaAverage;
    let strength;
    switch (rarity) {
        case 'common':
            strength = 2;
            manaAverage = 3;
            break;
        case 'rare':
            strength = 2.25;
            manaAverage = 6;
            break;
        case 'epic':
            strength = 2.5;
            manaAverage = 10;
            break;
        case 'legendary':
            strength = 2.75;
            manaAverage = 15;
            break;
        default:
            throw Error('invalid rarity');
    }
    let mana;
    do {
        mana = Math.round(normalDistribution(manaAverage));
    } while (mana >= 20);
    const denom = strength * mana;
    let off;
    do {
        off = Math.round(normalDistribution(denom * 0.4));
    } while (off * 1.5 >= denom);
    let def;
    do {
        def = Math.round(normalDistribution(off * 0.5));
    } while (off + def >= denom || def > off);
    const health = Math.round((denom - off - def) * 1.25);
    return {
        mana: mana,
        offense: off,
        defense: def,
        health: health,
    };
}

function normalDistribution(value) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5;
    if (num > 1 || num < 0) return normalDistribution(value);
    return num * 2 * value;
}