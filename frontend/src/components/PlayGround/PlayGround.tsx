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

let cardSelected = false;
let selectedCardIndex = -1;
let selectedEnemyCardIndex = -1;

const PlayGround: React.FC = () => {

    const [handCards, setHandCards] = useState<CardType[]>(getRandomCards(3));
    const [boardCards, setBoardCards] = useState<CardType[]>([]);
    const [enemyBoardCards, setEnemyBoardCards] = useState<CardType[]>(getRandomCards(4));
    const [hint, setHint] = useState('');

    const moveCard = (cardIndex: number) => {
        deselectCards();
        if (boardCards.length > 3) return showHint('Board is full.');
        handCards[cardIndex].index = boardCards.length;
        setBoardCards([...boardCards, handCards[cardIndex]]);
        removeCard(cardIndex, handCards, 'hand');
    };

    const removeCard = (cardIndex: number, container: CardType[], location: string) => {
        container.splice(cardIndex, 1);
        container.forEach((c, i) => {c.index = i;});
        if (location === 'hand') setHandCards([...container]);
        if (location === 'board') setBoardCards([...container]);
        if (location === 'enemyBoard') setEnemyBoardCards([...container]);
    };

    const drawCard = () => {
        deselectCards();
        if (handCards.length > 3) return showHint('Hand is full.');
        setHandCards([...handCards, getRandomCard(handCards.length)]);
    };

    const showHint = (text: string) => {
        setHint(text);
        setTimeout(() => setHint(''), 1500);
    };

    const selectCard = (cardIndex: number) => {
        deselectCards();
        boardCards[cardIndex].selected = true;
        selectedCardIndex = cardIndex;
        setBoardCards([...boardCards]);
        cardSelected = true;
    };

    const selectEnemyCard = (cardIndex: number) => {
        if (!cardSelected) return false;
        selectedEnemyCardIndex = cardIndex;
        attackCard();
    };

    const deselectCards = () => {
        if (selectedCardIndex !== -1 && boardCards[selectedCardIndex]) {
            boardCards[selectedCardIndex].selected = false;
            setBoardCards([...boardCards]);
            cardSelected = false;
        }
    };

    const attackCard = () => {
        removeCard(selectedCardIndex, boardCards, 'board');
        removeCard(selectedEnemyCardIndex, enemyBoardCards, 'enemyBoard');
        deselectCards();
    };

    return (
        <div className="playground">
            <DndProvider backend={Backend}>
                <EnemyBoard cards={enemyBoardCards} selectCard={selectEnemyCard}/>
                <Board cards={boardCards} selectCard={selectCard}/>
                <Hand cards={handCards} moveCard={moveCard}/>
                <Deck drawCard={drawCard}/>
                <Hint hint={hint}/>
            </DndProvider>
        </div>
    );
};

export default PlayGround;
