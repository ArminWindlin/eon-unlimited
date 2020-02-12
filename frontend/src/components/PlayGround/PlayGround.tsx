import React, {useEffect, useState} from 'react';
import './PlayGround.scss';
import Board from '../Board/Board';
import Hand from '../Hand/Hand';
import {DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import CardType from '../../interfaces/CardType';

const PlayGround: React.FC = () => {

    const [handCards, setHandCards] = useState<CardType[]>([
        {id: 0, title: 'Dragon'}, {id: 1, title: 'Dino'}, {id: 2, title: 'Dungo'}]);
    const [boardCards, setBoardCards] = useState<CardType[]>([]);

    // TODO: Testing, remove later
    const [count, setCount] = useState(0);

    // TODO: Testing, remove later
    useEffect(() => {
        document.title = `You clicked ${count} times`;
    }, [count]);

    const moveCard = (card: CardType) => {
        handCards.splice(handCards.findIndex(c => c.title === card.title), 1);
        setHandCards(handCards);
        setBoardCards([...boardCards, card]);
        console.log('cool');
    };

    return (
        <div className="playground">
            <DndProvider backend={Backend}>
                <p>You clicked {count} times</p>
                <button onClick={() => setCount(count + 1)}>
                    Click me
                </button>
                <Board cards={boardCards}/>
                <Hand cards={handCards} moveCard={moveCard}/>
            </DndProvider>
        </div>
    );
};

export default PlayGround;
