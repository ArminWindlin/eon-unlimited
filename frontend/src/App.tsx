import React from 'react';
import PlayGround from './components/PlayGround/PlayGround';
// import Chat from './components/Chat';
// TODO: info disabled chat, so i dont need to run backend, while only developing frontend

const App: React.FC = () => {
    return (
        <div className="app">
            <PlayGround/>
            {/*<Chat/>*/}
        </div>
    );
};

export default App;
