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
import Chat from './Chat/Chat';
import {DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import './PlayGround.scss';
import InGameMenu from './Displays/InGameMenu';

interface IPlayGround {
    surrender: () => void,
    toMenu: () => void
}

const PlayGround: React.FC<IPlayGround> = ({surrender, toMenu}) => {

    const [gameOverMessage, setGameOverMessage] = useState('');
    const [inGameMenu, setInGameMenu] = useState(false);
    const [opponent, setOpponent] = useState('');
    const [isBotMatch, setIsBotMatch] = useState(false);

    useEffect(() => {
        window.$socket.emit('GET_MATCH');
        window.$socket.on('MATCH_OVER', (data: string) => {
            setGameOverMessage(data);
        });
        window.$socket.on('UPDATE_MATCH', (data: any) => {
            console.log('Match ID: ' + data.matchId);
            setOpponent(data.opponent);
            setIsBotMatch(data.isBotMatch);
        });
        return () => {
            delete window.$socket._callbacks['$MATCH_OVER'];
            delete window.$socket._callbacks['$UPDATE_MATCH'];
        };
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    });

    const handleKeyDown = (e: any) => {
        if (e.code === 'Escape') {
            if (isBotMatch) toMenu();
            else setInGameMenu(true);
        }
    };

    return (
            <div className="playground">
                <DndProvider backend={Backend}>
                    <div className="playground-name">{window.$name}</div>
                    <div className="playground-enemy-name">{opponent}</div>
                    <Chat/>
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
                    {inGameMenu && <InGameMenu close={() => setInGameMenu(false)}
                                               surrender={surrender}/>}
                </DndProvider>
            </div>
    );
};

export default PlayGround;
