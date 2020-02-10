import React, {useEffect, useState} from 'react';
import './PlayGround.scss';
import Card from './Card';
import Board from './Board';
import {DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import CardType from '../interfaces/CardType';

const PlayGround: React.FC = () => {

    const [handCards, setHandCards] = useState<CardType[]>([
        {id: 0, title: 'Dragon'}, {id: 1, title: 'Dino'}, {id: 2, title: 'Dungo'}]);
    const [boardCards, setBoardCards] = useState<CardType[]>([]);

    // TODO: Testing, remove later
    const [count, setCount] = useState(0);
    const [fruit] = useState('banana');

    // TODO: Testing, remove later
    useEffect(() => {
        console.log('hey');
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
                <p>I like to eat {fruit}</p>
                <Board cards={boardCards}/>
                <div className="playground-card-container" id="playground-card-container-1">
                    {handCards.map((card, i) => {
                        return <Card card={card} moveCard={moveCard} key={i}/>;
                    })}
                </div>
            </DndProvider>
        </div>
    );
};

export default PlayGround;
