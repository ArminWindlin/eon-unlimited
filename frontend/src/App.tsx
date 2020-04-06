import React, {useEffect, useState} from 'react';
import {socket} from './utility/socket';
import PlayGround from './components/PlayGround/PlayGround';
import Auth from './components/Authentication/Auth';
import MatchMaking from './components/MatchMaking/MatchMaking';
import Menu from './components/Menu/Menu';
import Notification from './components/Various/Notification';

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

    useEffect(() => {
        const token = localStorage.getItem('token') || null;
        if (token) socket.emit('CONNECT_USER', token);
        else setActiveComponent('auth');
        socket.on('CONNECT_SUCCESS', (data: any) => {
            window.$name = data.name;
            window.$user = data;
            setActiveComponent('menu');
        });
        socket.on('CONNECT_SUCCESS_RECONNECT', (data: any) => {
            window.$name = data.name;
            window.$user = data;
            setActiveComponent('play');
        });
        socket.on('CONNECT_ERROR', () => {
            setActiveComponent('auth');
        });
        socket.on('UPDATE_TOKEN', (data: any) => {
            window.$name = data.user.name;
            window.$user = data.user;
            localStorage.setItem('token', data.token);
            setActiveComponent('menu');
        });
        window.$socket.on('MATCH_FOUND', (data: any) => {
            console.log('Match ID: ' + data.matchId);
            setOpponent(data.opponent);
            setActiveComponent('play');
        });
    }, []);

    const searchMatch = () => {
        setActiveComponent('matchmaking');
    };

    const startTestMatch = () => {
        window.$socket.emit('MATCH_SEARCH_BOT');
    };

    const surrenderMatch = () => {
        window.$socket.emit('MATCH_SURRENDER');
        window.location.reload();
    };

    const logout = async () => {
        setActiveComponent('auth');
    };

    const toMenu = () => {
        setActiveComponent('menu');
    };

    return (
            <div className="app">
                {activeComponent === 'auth' && <Auth/>}
                {activeComponent === 'menu' &&
                <Menu searchMatch={searchMatch} logout={logout} startTestMatch={startTestMatch}/>}
                {activeComponent === 'matchmaking' && <MatchMaking toMenu={toMenu}/>}
                {activeComponent === 'play' && <PlayGround opponent={opponent} surrender={surrenderMatch}/>}
                {activeComponent !== 'play' && <div className="logo-fixed">Eon Unlimited</div>}
                <Notification/>
            </div>
    );
};

export default App;

// global vars
declare global {
    interface Window {
        $socket: any,
        $name: string,
        $user: any
    }
}
