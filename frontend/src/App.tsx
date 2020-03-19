import React, {useEffect, useState} from 'react';
import {socket} from './utility/socket';
import PlayGround from './components/PlayGround/PlayGround';
import Auth from './components/Authentication/Auth';
import MatchMaking from './components/MatchMaking/MatchMaking';
import Menu from './components/Menu/Menu';

const App: React.FC = () => {

    /*
    * auth
    * loading
    * menu
    * matchmaking
    * play
    */
    const [activeComponent, setActiveComponent] = useState('loading');
    const [opponent, setOpponent] = useState('');
    const [initialised, setInitialised] = useState(false);

    useEffect(() => {
        if (initialised) return;
        const token = localStorage.getItem('token') || null;
        if (token) socket.emit('CONNECT_USER', token);
        else setActiveComponent('auth');
        socket.on('CONNECT_SUCCESS', (data: string) => {
            window.$name = data;
            setActiveComponent('menu');
        });
        socket.on('CONNECT_ERROR', () => {
            setActiveComponent('auth');
        });
        socket.on('UPDATE_TOKEN', (data: any) => {
            window.$name = data.userName;
            localStorage.setItem('token', data.token);
            setActiveComponent('menu');
        });
        window.$socket.on('MATCH_FOUND', (data: any) => {
            console.log('Match ID: ' + data.matchId);
            setOpponent(data.opponent);
            setActiveComponent('play');
        });
        setInitialised(true);
    }, []);

    const searchMatch = () => {
        setActiveComponent('matchmaking');
    };

    const logout = async () => {
        setActiveComponent('auth');
    };

    return (
            <div className="app">
                {activeComponent === 'auth' && <Auth/>}
                {activeComponent === 'menu' && <Menu searchMatch={searchMatch} logout={logout}/>}
                {activeComponent === 'matchmaking' && <MatchMaking/>}
                {activeComponent === 'play' && <PlayGround opponent={opponent}/>}
                {activeComponent !== 'play' && <div className="logo-fixed">Eon Unlimited</div>}
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
