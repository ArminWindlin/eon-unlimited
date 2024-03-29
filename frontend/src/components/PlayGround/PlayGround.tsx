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
import GameOver from './Displays/GameOver';
import Chat from './Chat/Chat';
import {DndProvider} from 'react-dnd';
import dndBackend from 'react-dnd-html5-backend';
import dndTouchBackend from 'react-dnd-touch-backend';
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
    const isMobile = window.innerHeight < 500;

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
            setInGameMenu(true);
        }
    };

    const pause = () => {
        window.$socket.emit('MATCH_SURRENDER');
        toMenu();
    };

    const endBotMatch = () => {
        window.$socket.emit('MATCH_SURRENDER_BOT');
        toMenu();
    };

    return (
            <div className="playground">
                <DndProvider backend={isMobile ? dndTouchBackend : dndBackend}>
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
                    {gameOverMessage !== '' && <GameOver message={gameOverMessage}/>}
                    {inGameMenu && <InGameMenu close={() => setInGameMenu(false)}
                                               surrender={endBotMatch}
                                               pause={pause}
                                               isBotMatch={isBotMatch}/>}
                </DndProvider>
            </div>
    );
};

export default PlayGround;
