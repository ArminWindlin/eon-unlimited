import React from 'react';
import './Card.scss';
import {DragSourceMonitor, useDrag} from 'react-dnd';
import ItemTypes from '../ItemTypes';
import CardType from '../interfaces/CardType';

interface CardProps {
    card: CardType,
    moveCard: (cardID: CardType) => void
}

const Card: React.FC<CardProps> = ({card, moveCard}) => {

    const [{isDragging}, drag] = useDrag({
        item: {name: card.title, type: ItemTypes.CARD},
        end: (item: { name: string } | undefined, monitor: DragSourceMonitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                console.log(`You dropped ${item.name} into ${dropResult.name}!`);
                moveCard(card);
            }
        },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0.4 : 1;
    let opacityStyle: React.CSSProperties = {opacity: opacity};

    return (
        <div className="card" ref={drag} style={opacityStyle}>
            {card.title}
        </div>
    );
};

export default Card;
