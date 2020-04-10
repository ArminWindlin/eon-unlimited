import React from 'react';
import './Display.scss';

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
            <div className="game-over-replay clickable" onClick={reload}>To Menu</div>
        </div>
    );
};

export default GameOver;
