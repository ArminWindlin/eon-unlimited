import React from 'react';
import './EnemyBoard.scss';
import Card from '../Card/Card';
import CardType from '../../interfaces/CardType';

interface BoardProps {
    cards: CardType[],
    selectCard: (cardIndex: number) => void
}

const EnemyBoard: React.FC<BoardProps> = ({cards, selectCard}) => {

    const moveCard = (cardIndex: number) => {
    };

    return (
        <div className="enemy-board">
            <div className="enemy-board-card-container flex jc-c ai-c">
                {cards.map((card, i) => {
                    return <Card card={card} moveCard={moveCard} selectCard={selectCard} draggable={false} key={i}/>;
                })}
            </div>
        </div>
    );
};

export default EnemyBoard;
