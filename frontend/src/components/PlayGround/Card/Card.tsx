import React from 'react';
import './Card.scss';
import {DragSourceMonitor, useDrag} from 'react-dnd';
import ItemTypes from '../../../interfaces/ItemTypes';
import CardType from '../../../interfaces/CardType';

interface CardProps {
    card: CardType,
    draggable: boolean,
}

const Card: React.FC<CardProps> = ({card, draggable = true}) => {

    const [{isDragging}, drag] = useDrag({
        item: {name: card.name, type: ItemTypes.CARD},
        end: (item: { name: string } | undefined, monitor: DragSourceMonitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                console.log(`You dropped ${item.name} into ${dropResult.name}!`);
                window.$socket.emit('ACTION_PLAY', card.index);
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

    const selectCard = () => {
        if(card.place === 'hand') return;
        window.$socket.emit('SELECT_CARD', {index: card.index, side: card.side});
    };

    return (
            <div className={'card' + (card.selected ? ' selected' : '')} ref={dragRef} style={opacityStyle}
                 onClick={selectCard}>
                <div className="card-title">{card.name} ({card.rarity})</div>
                <div className="card-stat card-health">{card.health}</div>
                <div className="card-stat card-defense">{card.defense}</div>
                <div className="card-stat card-offense">{card.offense}</div>
                <div className="card-stat card-mana">{card.mana}</div>
            </div>
    );
};

export default Card;
