import React, {useEffect, useState} from 'react';
import Board from './Board/Board';
import EnemyBoard from './Board/EnemyBoard';
import Hand from './Hand/Hand';
import Deck from './Deck/Deck';
import Hint from './Hint/Hint';
import Life from './Life/Life';
import EnemyLife from './Life/EnemyLife';
import Actions from './Actions/Actions';
import EnemyActions from './Actions/EnemyActions';
import Mana from './Mana/Mana';
import EnemyMana from './Mana/EnemyMana';
import GameOver from './Displays/GameOver';
import {DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import {socket} from '../../utility/socket';

const PlayGround: React.FC = () => {

    const [gameOverMessage, setGameOverMessage] = useState('');

    useEffect(() => {
        socket.emit('MATCH_SEARCH');
        socket.on('MATCH_FOUND', (data: string) => {
            console.log('Match ID: ' + data);
        });
        socket.on('MATCH_OVER', (data: string) => {
            setGameOverMessage(data);
        });
    }, []);

    return (
            <div className="playground">
                <DndProvider backend={Backend}>
                    <EnemyBoard/>
                    <Board/>
                    <Hand/>
                    <Deck/>
                    <Hint/>
                    <Life/>
                    <EnemyLife/>
                    <Actions/>
                    <EnemyActions/>
                    <Mana/>
                    <EnemyMana/>
                    {gameOverMessage !== '' && <GameOver message={gameOverMessage}/>}
                </DndProvider>
            </div>
    );
};

export default PlayGround;
