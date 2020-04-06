import {disconnect, getOpponentSide, runningMatches, startMatch} from './matchC';

describe('Match Controller', () => {
    beforeAll(() => {

    });

    it('starts a match', () => {
        startMatch(123, true);
        expect(runningMatches.get(123).started).toBe(true);
    });

    it('closes a match', () => {
        disconnect(123);
        expect(runningMatches.has(123)).toBe(false);
    });

    it('retrieves correct opponent side', () => {
        expect(getOpponentSide(1)).toBe(2);
        expect(getOpponentSide(2)).toBe(1);
    });
});
