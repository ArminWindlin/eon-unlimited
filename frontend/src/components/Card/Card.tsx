import React from 'react';
import './Card.scss';
import {DragSourceMonitor, useDrag} from 'react-dnd';
import ItemTypes from '../../interfaces/ItemTypes';
import CardType from '../../interfaces/CardType';

interface CardProps {
    card: CardType,
    moveCard: (cardID: CardType) => void,
    draggable: boolean
}

const Card: React.FC<CardProps> = ({card, moveCard, draggable = true}) => {

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

    // enable or disable drag
    const dragRef = draggable ? drag : null;

    const opacity = isDragging ? 0.4 : 1;
    let opacityStyle: React.CSSProperties = {opacity: opacity};

    return (
        <div className="card" ref={dragRef} style={opacityStyle}>
            <div className="card-title">{card.title}</div>
            <div className="card-health">{card.health}</div>
        </div>
    );
};

export default Card;
