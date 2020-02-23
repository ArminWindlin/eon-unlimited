import React from 'react';
import './Card.scss';
import {DragSourceMonitor, useDrag} from 'react-dnd';
import ItemTypes from '../../interfaces/ItemTypes';
import CardType from '../../interfaces/CardType';
import {socket} from '../../utility/socket';

interface CardProps {
    card: CardType,
    draggable: boolean,
}

const Card: React.FC<CardProps> = ({card, draggable = true}) => {

    const [{isDragging}, drag] = useDrag({
        item: {name: card.title, type: ItemTypes.CARD},
        end: (item: { name: string } | undefined, monitor: DragSourceMonitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                console.log(`You dropped ${item.name} into ${dropResult.name}!`);
                socket.emit('ACTION_PLAY', card.index);
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
        socket.emit('SELECT_CARD', {index: card.index, position: card.position});
    };

    return (
            <div className={'card' + (card.selected ? ' selected' : '')} ref={dragRef} style={opacityStyle}
                 onClick={selectCard}>
                <div className="card-title">{card.title}</div>
                <div className="card-health">{card.health}</div>
            </div>
    );
};

export default Card;
