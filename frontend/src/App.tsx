import React, {useEffect, useState} from 'react';
import {socket} from './utility/socket';
import PlayGround from './components/PlayGround/PlayGround';
import Auth from './components/Authentication/Auth';
import MatchMaking from './components/MatchMaking/MatchMaking';
// import Chat from './components/Chat';
// TODO: info disabled chat, so i dont need to run backend, while only developing frontend

const App: React.FC = () => {

    /*
    * auth
    * loading
    * matchmaking
    * play
    */
    const [activeComponent, setActiveComponent] = useState('loading');
    const [opponent, setOpponent] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token') || null;
        if (token) socket.emit('CONNECT_USER', token);
        else setActiveComponent('auth');
        socket.on('CONNECT_SUCCESS', (data: string) => {
            window.$name = data;
            setActiveComponent('matchmaking');
        });
        socket.on('CONNECT_ERROR', () => {
            setActiveComponent('auth');
        });
        socket.on('UPDATE_TOKEN', (data: any) => {
            window.$name = data.userName;
            localStorage.setItem('token', data.token);
            setActiveComponent('matchmaking');
        });
        window.$socket.on('MATCH_FOUND', (data: any) => {
            console.log('Match ID: ' + data.matchId);
            setOpponent(data.opponent);
            setActiveComponent('play');
        });
    }, []);

    return (
        <div className="app">
            {activeComponent === 'auth' && <Auth/>}
            {activeComponent === 'matchmaking' && <MatchMaking/>}
            {activeComponent === 'play' && <PlayGround opponent={opponent}/>}
            {/*<Chat/>*/}
        </div>
    );
};

export default App;

// global vars
declare global {
    interface Window {
        $socket: any,
        $name: string
    }
}
