import React, {useEffect} from 'react';
import './PlayGround.scss';
import Board from '../Board/Board';
import EnemyBoard from '../Board/EnemyBoard';
import Hand from '../Hand/Hand';
import Deck from '../Deck/Deck';
import Hint from '../Hint/Hint';
import Life from '../Life/Life';
import EnemyLife from '../Life/EnemyLife';
import {DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import {socket} from '../../utility/socket';

const PlayGround: React.FC = () => {

    useEffect(() => {
        socket.emit('MATCH_SEARCH');
        socket.on('MATCH_FOUND', (data: string) => {
            console.log('Match ID: ' + data);
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
                </DndProvider>
            </div>
    );
};

export default PlayGround;
