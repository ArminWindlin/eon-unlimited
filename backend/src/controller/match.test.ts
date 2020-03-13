import { disconnect, getOpponentSide, runningMatches, startMatch } from './matchC';

describe('Match Controller', () => {
    beforeAll(() => {

    });

    it('starts a match', () => {
        expect(runningMatches.length).toBe(0);
        startMatch(123);
        expect(runningMatches.length).toBe(1);
        expect(runningMatches[0].started).toBe(true);
    });

    it('closes a match', () => {
        expect(runningMatches[0].closed).toBe(false);
        disconnect(123);
        expect(runningMatches[0].closed).toBe(true);
    });

    it('retrieves correct opponent side', () => {
        expect(getOpponentSide(1)).toBe(2);
        expect(getOpponentSide(2)).toBe(1);
    })
});
