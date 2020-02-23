import React from 'react';
import './Deck.scss';
import {socket} from '../../utility/socket';

const Deck: React.FC = () => {

    const draw = () => {
        socket.emit('ACTION_DRAW');
    };

    return (
        <div className="deck" onClick={draw}>Draw</div>
    );
};

export default Deck;
