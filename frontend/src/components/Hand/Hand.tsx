import React from 'react';
import './Hand.scss';
import Card from '../Card/Card';
import CardType from '../../interfaces/CardType';

interface BoardProps {
    cards: CardType[],
    moveCard: (cardIndex: number) => void
}

const Hand: React.FC<BoardProps> = ({cards, moveCard}) => {

    const selectCard = (cardIndex: number) => {
        return false;
    };

    return (
        <div className="hand">
            <div className="hand-card-container flex jc-c ai-c">
                {cards.map((card, i) => {
                    return <Card card={card} moveCard={moveCard} selectCard={selectCard} draggable={true} key={i}/>;
                })}
            </div>
        </div>
    );
};

export default Hand;
