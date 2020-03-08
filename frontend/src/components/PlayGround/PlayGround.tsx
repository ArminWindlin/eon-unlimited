import React, {useEffect, useState} from 'react';
import Board from './Board/Board';
import EnemyBoard from './Board/EnemyBoard';
import Hand from './Hand/Hand';
import Deck from './Deck/Deck';
import Hint from './Hint/Hint';
import Life from './PlayerVitals/Life';
import EnemyLife from './PlayerVitals/EnemyLife';
import Actions from './PlayerVitals/Actions';
import EnemyActions from './PlayerVitals/EnemyActions';
import Mana from './PlayerVitals/Mana';
import EnemyMana from './PlayerVitals/EnemyMana';
import GameOver from './Displays/GameOver';
import {DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import './PlayGround.scss';

interface IPlayGround {
    opponent: string
}

const PlayGround: React.FC<IPlayGround> = ({opponent}) => {

    const [gameOverMessage, setGameOverMessage] = useState('');

    useEffect(() => {
        window.$socket.emit('MATCH_SEARCH');
        window.$socket.on('MATCH_OVER', (data: string) => {
            setGameOverMessage(data);
        });
    }, []);

    return (
            <div className="playground">
                <DndProvider backend={Backend}>
                    <div className="playground-name">{window.$name}</div>
                    <div className="playground-enemy-name">{opponent}</div>
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
