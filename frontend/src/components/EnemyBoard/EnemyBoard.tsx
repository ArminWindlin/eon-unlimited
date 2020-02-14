import React from 'react';
import './EnemyBoard.scss';
import Card from '../Card/Card';
import CardType from '../../interfaces/CardType';

interface BoardProps {
    cards: CardType[],
}

const EnemyBoard: React.FC<BoardProps> = ({cards}) => {

    const moveCard = (cardID: CardType) => {
        console.log('can\'t be movet from here');
    };

    return (
        <div className="enemy-board">
            <div className="enemy-board-card-container flex jc-c ai-c">
                {cards.map((card, i) => {
                    return <Card card={card} moveCard={moveCard} draggable={false} key={i}/>;
                })}
            </div>
        </div>
    );
};

export default EnemyBoard;
