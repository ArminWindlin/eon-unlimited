import React, {useEffect, useState} from 'react';
import './Card.scss';
import {DragSourceMonitor, useDrag} from 'react-dnd';
import ItemTypes from '../../../interfaces/ItemTypes';
import CardType from '../../../interfaces/CardType';

interface CardProps {
    card: CardType,
    draggable: boolean,
    onBoard: boolean,
}

const Card: React.FC<CardProps> = ({card, draggable = true, onBoard}) => {

    const [attackBar, setAttackBar] = useState(false);
    const [attackBarEmpty, setAttackBarEmpty] = useState(false);
    const [attackBarAnim, setAttackBarAnim] = useState(false);
    const [attackBarLoading, setAttackBarLoading] = useState(false);
    const [protectBar, setProtectBar] = useState(false);
    const [protectBarAnim, setProtectBarAnim] = useState(false);

    useEffect(() => {
        if (onBoard) {
            if (card.protectedUntil && card.protectedUntil > Date.now() - 3 * 3000) {
                setProtectBar(true);
                setTimeout(() => setProtectBarAnim(true), 100);
            }
            if (card.attackAt && card.attackAt > Date.now() && !attackBarLoading) {
                setAttackBarAnim(false);
                setAttackBarLoading(true);
                setAttackBarEmpty(true);
                setTimeout(() => setAttackBarAnim(true), 100);
                setTimeout(() => setAttackBarLoading(false), 5000);
            } else setAttackBar(true);
        }
    }, [card, onBoard, attackBarLoading]);

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
        if (card.place === 'hand') return;
        window.$socket.emit('SELECT_CARD', {index: card.index, side: card.side});
    };

    return (
            <div className={'card' + (card.selected ? ' selected ' : ' ') + card.rarity}
                 ref={dragRef} style={opacityStyle}
                 onClick={selectCard}>
                <div className="card-image"
                     style={{backgroundImage: `url(${`cards/${card.image}.png`})`}}/>
                <div className="card-deco"/>
                <div className="card-title">{card.name}</div>
                <div className="card-stat card-health">{card.health}</div>
                <div className="card-stat card-defense">{card.defense}</div>
                <div className="card-stat card-offense">{card.offense}</div>
                <div className="card-stat card-mana">{card.mana}</div>
                <div className={
                    (attackBar ? 'card-attack-bar' : '') +
                    (attackBarAnim ? ' fill' : '') +
                    (attackBarEmpty ? ' empty' : '')}
                />
                <div className={(protectBar ? 'card-protect-bar' : '') + (protectBarAnim ? ' no-fill' : '')}/>
            </div>
    );
};

export default Card;
