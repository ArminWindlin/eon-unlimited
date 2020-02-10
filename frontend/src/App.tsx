import React from 'react';
import PlayGround from './components/PlayGround';
import Chat from './components/Chat';
import './App.scss';

const App: React.FC = () => {
    return (
        <div className="app">
            <PlayGround/>
            <Chat/>
        </div>
    );
};

export default App;
