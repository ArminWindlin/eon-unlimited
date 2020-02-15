import React, {Dispatch, SetStateAction, useState} from 'react';
import './Card.scss';
import {DragSourceMonitor, useDrag} from 'react-dnd';
import ItemTypes from '../../interfaces/ItemTypes';
import CardType from '../../interfaces/CardType';

interface CardProps {
    card: CardType,
    draggable: boolean,
    moveCard: (card: CardType) => void,
    selectCard: (card: CardType, setSelected: Dispatch<SetStateAction<boolean>>) => boolean
}

const Card: React.FC<CardProps> = ({card, moveCard, selectCard, draggable = true}) => {

    const [selected, setSelected] = useState(false);

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

    const trySelect = () => {
        if (selectCard(card, setSelected)) setSelected(true);
    };

    return (
        <div className={'card' + (selected ? ' selected' : '')} ref={dragRef} style={opacityStyle}
             onClick={trySelect}>
            <div className="card-title">{card.title}</div>
            <div className="card-health">{card.health}</div>
        </div>
    );
};

export default Card;
