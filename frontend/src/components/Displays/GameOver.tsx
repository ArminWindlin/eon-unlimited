import React from 'react';
import './GameOver.scss';

interface IGameOver {
    message: string
}

const GameOver: React.FC<IGameOver> = ({message}) => {

    const reload = () => {
        window.location.reload();
    };

    return (
        <div className="game-over">
            <div className="game-over-message">{message}</div>
            <div className="game-over-replay clickable" onClick={reload}> Replay</div>
        </div>
    );
};

export default GameOver;
