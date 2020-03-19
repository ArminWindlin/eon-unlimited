let EVENTS: {[event: string]: any[]} = {};

interface SocketMock {
    on: (event: string, func: Function) => void,
    emit: (event: string, ...args: []) => void
}

function emit(event: string, ...args: []): void {
    EVENTS[event].forEach(func => func(...args));
}

const socket: SocketMock = {
    on(event, func) {
        if (EVENTS[event]) {
            return EVENTS[event].push(func);
        }
        EVENTS[event] = [func];
    },
    emit
};

export const io = {
    connect() {
        return socket;
    }
};

export const serverSocket = { emit };

export function cleanup() {
    EVENTS = {}
}

export default io
