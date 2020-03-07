import React, {useEffect, useState} from 'react';
import {socket} from './utility/socket';
import PlayGround from './components/PlayGround/PlayGround';
import Auth from './components/Authentication/Auth';
// import Chat from './components/Chat';
// TODO: info disabled chat, so i dont need to run backend, while only developing frontend

const App: React.FC = () => {

    const [activeComponent, setActiveComponent] = useState('loading');

    useEffect(() => {
        const token = localStorage.getItem('token') || null;
        if(token) socket.emit('CONNECT_USER', token);
        else setActiveComponent('auth');
        socket.on('CONNECT_SUCCESS', () => {
            setActiveComponent('play');
        });
        socket.on('CONNECT_ERROR', () => {
            setActiveComponent('auth');
        });
        socket.on('UPDATE_TOKEN', (data: string) => {
            localStorage.setItem('token', data);
            setActiveComponent('play');
        });
    }, []);

    return (
        <div className="app">
            {activeComponent === 'auth' && <Auth/>}
            {activeComponent === 'play' && <PlayGround/>}
            {/*<Chat/>*/}
        </div>
    );
};

export default App;
