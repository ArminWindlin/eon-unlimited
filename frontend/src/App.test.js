import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import mockIo, { serverSocket, cleanup } from './testing/socket-mocket';
import App from './App';

let app;
let socket;

beforeAll(() => {
    app = render(<App />);
    socket = mockIo.connect();
});

test('shows loading screen', () => {



    expect('this').toBe('this');
});
