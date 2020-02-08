import React, {useEffect, useState} from 'react';
import './PlayGround.scss';
import Card from './Card';
import Board from './Board';
import {DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import CardI from '../interfaces/Card';

const PlayGround: React.FC = () => {

    const [count, setCount] = useState(0);
    const [cardPosition, setCardPosition] = useState('relative');
    const [fruit] = useState('banana');
    const [handCards, setHandCards] = useState<CardI[]>([
        {title: 'Dragon'}, {title: 'Dino'}, {title: 'Dungo'}]);
    const [boardCards, setBoardCards] = useState<CardI[]>([]);

    useEffect(() => {
        console.log('hey');
        //incCount();
        document.title = `You clicked ${count} times`;
    }, [count]);

    function incCount() {
        setCount(42);
    }

    const moveCard = (card: CardI) => {
        handCards.splice(handCards.findIndex(c => c.title === card.title), 1);
        setHandCards(handCards);
        setBoardCards([...boardCards, card]);
        console.log('cool');
    };

    return (
        <div className="play-ground">
            <DndProvider backend={Backend}>
                <p>You clicked {count} times</p>
                <button onClick={() => setCount(count + 1)}>
                    Click me
                </button>
                <p>I like to eat {fruit}</p>
                <Board cards={boardCards}/>
                <div className="card-container" id="card-container-1">
                    {handCards.map((card, i) => {
                        return <Card card={card} moveCard={moveCard} key={i}/>;
                    })}
                </div>
            </DndProvider>
        </div>
    );
};

export default PlayGround;
