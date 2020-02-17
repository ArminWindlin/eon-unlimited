import React from 'react';
import './Card.scss';
import {DragSourceMonitor, useDrag} from 'react-dnd';
import ItemTypes from '../../interfaces/ItemTypes';
import CardType from '../../interfaces/CardType';

interface CardProps {
    card: CardType,
    draggable: boolean,
    moveCard: (cardIndex: number) => void,
    selectCard: (cardIndex: number) => void
}

const Card: React.FC<CardProps> = ({card, moveCard, selectCard, draggable = true}) => {

    const [{isDragging}, drag] = useDrag({
        item: {name: card.title, type: ItemTypes.CARD},
        end: (item: { name: string } | undefined, monitor: DragSourceMonitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                console.log(`You dropped ${item.name} into ${dropResult.name}!`);
                moveCard(card.index);
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
        <div className={'card' + (card.selected ? ' selected' : '')} ref={dragRef} style={opacityStyle}
             onClick={() => selectCard(card.index)}>
            <div className="card-title">{card.title}</div>
            <div className="card-health">{card.health}</div>
        </div>
    );
};

export default Card;
