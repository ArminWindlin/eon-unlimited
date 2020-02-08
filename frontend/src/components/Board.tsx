import React from 'react';
import './Board.scss';
import {useDrop} from 'react-dnd';
import ItemTypes from '../ItemTypes';
import Card from './Card';
import CardType from '../interfaces/CardType';

interface BoardProps {
    cards: CardType[],
}

const Board: React.FC<BoardProps> = ({cards}) => {

    const [{canDrop, isOver}, drop] = useDrop({
        accept: ItemTypes.CARD,
        drop: () => ({name: 'Board'}),
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    const isActive = canDrop && isOver;
    let backgroundColor = 'green';
    if (isActive) backgroundColor = 'lightgreen';
    else if (canDrop) backgroundColor = 'darkkhaki';
    let backgroundColorStyle: React.CSSProperties = {backgroundColor: backgroundColor};

    const moveCard = (cardID: CardType) => {
        console.log('can\'t be movet from here');
    };

    return (
        <div className="board">
            <div className="card-container" ref={drop} style={backgroundColorStyle}>
                {cards.map((card, i) => {
                    return <Card card={card} moveCard={moveCard} key={i}/>;
                })}
            </div>
        </div>
    );
};

export default Board;
