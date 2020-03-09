import io from 'socket.io-client';

let url = 'http://localhost:4000';

if (process.env.NODE_ENV === 'production') {
    url = 'https://backend-dot-eon-unlimited-42.appspot.com';
}
console.log('Backend-Url:' + url);

export const socket = io(url, {transports: ['websocket', 'polling']});

// set socket as globally
window.$socket = socket;
