import React, {useState} from 'react';
import './PlayGround.scss';
import Board from '../Board/Board';
import EnemyBoard from '../EnemyBoard/EnemyBoard';
import Hand from '../Hand/Hand';
import Deck from '../Deck/Deck';
import Hint from '../Hint/Hint';
import {DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import CardType from '../../interfaces/CardType';
import {getRandomCard, getRandomCards} from '../../utility/cardFunctions';

const PlayGround: React.FC = () => {

    const [handCards, setHandCards] = useState<CardType[]>(getRandomCards(3));
    const [boardCards, setBoardCards] = useState<CardType[]>([]);
    const [enemyBoardCards, setEnemyBoardCards] = useState<CardType[]>(getRandomCards(3));
    const [hint, setHint] = useState('');

    const moveCard = (card: CardType) => {
        if (boardCards.length > 3) return showHint('Board is full.');
        handCards.splice(handCards.findIndex(c => c.title === card.title), 1);
        setHandCards(handCards);
        setBoardCards([...boardCards, card]);
    };

    const drawCard = () => {
        if (handCards.length > 3) return showHint('Hand is full.');
        setHandCards([...handCards, getRandomCard()]);
    };

    const showHint = (text: string) => {
        setHint(text);
        setTimeout(() => setHint(''), 1500);
    };

    return (
        <div className="playground">
            <DndProvider backend={Backend}>
                <EnemyBoard cards={enemyBoardCards}/>
                <Board cards={boardCards}/>
                <Hand cards={handCards} moveCard={moveCard}/>
                <Deck drawCard={drawCard}/>
                <Hint hint={hint}/>
            </DndProvider>
        </div>
    );
};

export default PlayGround;
