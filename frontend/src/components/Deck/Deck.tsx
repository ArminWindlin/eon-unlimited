import React from 'react';
import './Deck.scss';

interface DeckProps {
    drawCard: () => void,
}

const Deck: React.FC<DeckProps> = ({drawCard}) => {
    return (
        <div className="deck" onClick={drawCard}>Draw</div>
    );
};

export default Deck;
