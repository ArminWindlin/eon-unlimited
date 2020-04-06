import React, {useEffect, useState} from 'react';
import './Board.scss';
import {useDrop} from 'react-dnd';
import ItemTypes from '../../../interfaces/ItemTypes';
import Card from '../Card/Card';
import CardType from '../../../interfaces/CardType';

const Board: React.FC = () => {

    const [{canDrop, isOver}, drop] = useDrop({
        accept: ItemTypes.CARD,
        drop: () => ({name: 'Board'}),
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    const [cards, setCards] = useState<CardType[]>([]);

    useEffect(() => {
        window.$socket.on('UPDATE_BOARD', (data: CardType[]) => {
            setCards(data);
        });
        return () => {
            delete window.$socket._callbacks['$UPDATE_BOARD'];
        };
    }, []);

    const isActive = canDrop && isOver;
    let backgroundColor = 'transparent';
    if (isActive) backgroundColor = 'rgba(172, 166, 115, 0.9)';
    else if (canDrop) backgroundColor = 'rgba(172, 166, 115, 0.4)';

    return (
            <div className="board">
                <div className="board-card-container flex jc-c ai-c" ref={drop}
                     style={{backgroundColor: backgroundColor}}>
                    {cards.map((card, i) => {
                        return <Card card={card} draggable={false} key={i}/>;
                    })}
                </div>
            </div>
    );
};

export default Board;
