import React from 'react';
import './Deck.scss';

const Deck: React.FC = () => {

    const draw = () => {
        window.$socket.emit('ACTION_DRAW');
    };

    return (
            <div className="deck" onClick={draw}>Draw</div>
    );
};

export default Deck;
