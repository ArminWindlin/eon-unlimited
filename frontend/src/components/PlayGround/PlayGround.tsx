import React, {useEffect, useState} from 'react';
import './PlayGround.scss';
import Board from '../Board/Board';
import EnemyBoard from '../EnemyBoard/EnemyBoard';
import Hand from '../Hand/Hand';
import Deck from '../Deck/Deck';
import Hint from '../Hint/Hint';
import {DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import CardType from '../../interfaces/CardType';
import {getRandomCards} from '../../utility/cardFunctions';
import {socket} from '../../utility/socket';

let cardSelected = false;
let selectedCardIndex = -1;
let selectedEnemyCardIndex = -1;

const PlayGround: React.FC = () => {

    const [boardCards, setBoardCards] = useState<CardType[]>([]);
    const [enemyBoardCards, setEnemyBoardCards] = useState<CardType[]>(getRandomCards(4));

    useEffect(() => {
        socketSetup();
    }, []);

    const socketSetup = () => {
        socket.emit('MATCH_SEARCH');
        socket.on('MATCH_FOUND', (data: string) => {
            console.log(data);
        });
    };

    const removeCard = (cardIndex: number, container: CardType[], location: string) => {
        container.splice(cardIndex, 1);
        container.forEach((c, i) => {
            c.index = i;
        });
        if (location === 'board') setBoardCards([...container]);
        if (location === 'enemyBoard') setEnemyBoardCards([...container]);
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
                    <Board selectCard={selectCard}/>
                    <Hand/>
                    <Deck/>
                    <Hint/>
                </DndProvider>
            </div>
    );
};

export default PlayGround;
