import React from 'react';
import './Board.scss';
import {useDrop} from 'react-dnd';
import ItemTypes from '../ItemTypes';
import Card from './Card';
import CardI from '../interfaces/Card';

interface BoardProps {
    cards: any[],
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
    let backgroundColor = 'red';
    if (isActive) backgroundColor = 'darkgreen';
    else if (canDrop) backgroundColor = 'darkkhaki';
    let backgroundColorStyle: React.CSSProperties = {backgroundColor: backgroundColor};

    const moveCard = (card: CardI) => {
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
