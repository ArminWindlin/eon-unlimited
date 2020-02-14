import React, {useState} from 'react';
import './PlayGround.scss';
import Board from '../Board/Board';
import EnemyBoard from '../EnemyBoard/EnemyBoard';
import Hand from '../Hand/Hand';
import {DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import CardType from '../../interfaces/CardType';

const PlayGround: React.FC = () => {

    const [handCards, setHandCards] = useState<CardType[]>([
        {id: 0, title: 'Dragon'}, {id: 1, title: 'Dino'}, {id: 2, title: 'Dungo'}]);
    const [boardCards, setBoardCards] = useState<CardType[]>([]);
    const [enemyBoardCards, setEnemyBoardCards] = useState<CardType[]>([
        {id: 0, title: 'Dragon'}, {id: 1, title: 'Dino'}, {id: 2, title: 'Dungo'}]);

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
