import { addUser } from './userC'
import { socketClientMap, clientSocketMap } from '../socket'

beforeAll(() => {
    socketClientMap.clear();
    clientSocketMap.clear();
});

describe('User Controller', () => {
    it('adds a user', () => {
        expect(socketClientMap.size).toBe(0);
        addUser('User1', 1);
        console.log(socketClientMap);
        expect(socketClientMap.size).toBe(1);
    })
});
