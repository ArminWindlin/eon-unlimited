import React, {useState} from 'react';
import './PlayGround.scss';
import Board from '../Board/Board';
import EnemyBoard from '../EnemyBoard/EnemyBoard';
import Hand from '../Hand/Hand';
import {DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import CardType from '../../interfaces/CardType';
import {getRandomCards} from '../../utility/cardFunctions'

const PlayGround: React.FC = () => {

    const [handCards, setHandCards] = useState<CardType[]>(getRandomCards(3));
    const [boardCards, setBoardCards] = useState<CardType[]>([]);
    const [enemyBoardCards, setEnemyBoardCards] = useState<CardType[]>(getRandomCards(3));

    const moveCard = (card: CardType) => {
        handCards.splice(handCards.findIndex(c => c.title === card.title), 1);
        setHandCards(handCards);
        setBoardCards([...boardCards, card]);
        console.log('cool');
    };

    return (
        <div className="playground">
            <DndProvider backend={Backend}>
                <EnemyBoard cards={enemyBoardCards}/>
                <Board cards={boardCards}/>
                <Hand cards={handCards} moveCard={moveCard}/>
            </DndProvider>
        </div>
    );
};

export default PlayGround;
