import { getRandomCard, getRandomCards } from './cardFunctions'

import Card from '../interfaces/card'

describe('Random cards', () => {
    it('Bulk cards are random', () => {
        const firstRun: Card[] = getRandomCards(10);
        const secondRun: Card[] = getRandomCards(10);
        expect(firstRun.map(card => card.title)).not.toEqual(secondRun.map(card => card.title))
    });

    it('Card IDs are unique', () => {
        const cards: Card[] = getRandomCards(1000);
        const seen = [];
        for (let card of cards) {
            expect(seen).not.toContain(card.id);
            seen.push(card.id)
        }
    });
});


