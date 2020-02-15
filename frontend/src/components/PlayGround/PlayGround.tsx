import React, {Dispatch, SetStateAction, useState} from 'react';
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
    const [enemyBoardCards, setEnemyBoardCards] = useState<CardType[]>(getRandomCards(4));
    const [hint, setHint] = useState('');

    let cardSelected = false;
    let selectedCard: CardType;
    let selectedEnemyCard: CardType;

    // to manipulate selected state of cards
    let markCard: Dispatch<SetStateAction<boolean>>;

    const moveCard = (card: CardType) => {
        deselectCards();
        if (boardCards.length > 3) return showHint('Board is full.');
        removeCard(card, handCards, 'hand');
        setBoardCards([...boardCards, card]);
    };

    const removeCard = (card: CardType, container: CardType[], location: string) => {
        // TODO: make sure remove criteria is unique (atm cards can have same id)
        let index = container.findIndex(c => c.id === card.id);
        if (index === -1) return;
        container.splice(index, 1);
        if (location === 'hand') setHandCards([...container]);
        if (location === 'board') setBoardCards([...container]);
        if (location === 'enemyBoard') setEnemyBoardCards([...container]);
    };

    const drawCard = () => {
        deselectCards();
        if (handCards.length > 3) return showHint('Hand is full.');
        setHandCards([...handCards, getRandomCard()]);
    };

    const showHint = (text: string) => {
        setHint(text);
        setTimeout(() => setHint(''), 1500);
    };

    const selectCard = (card: CardType, setCardMarker: Dispatch<SetStateAction<boolean>>) => {
        deselectCards();
        selectedCard = card;
        markCard = setCardMarker;
        cardSelected = true;
        return true;
    };

    const selectEnemyCard = (card: CardType, markCard: Dispatch<SetStateAction<boolean>>) => {
        if (!cardSelected) return false;
        selectedEnemyCard = card;
        attackCard();
        return false;
    };

    const deselectCards = () => {
        if (markCard) markCard(false);
        cardSelected = false;
    };

    const attackCard = () => {
        removeCard(selectedCard, boardCards, 'board');
        removeCard(selectedEnemyCard, enemyBoardCards, 'enemyBoard');
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
