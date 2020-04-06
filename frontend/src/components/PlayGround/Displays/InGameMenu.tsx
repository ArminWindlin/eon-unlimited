import React from 'react';
import './Display.scss';

interface IInGameMenu {
    isBotMatch: boolean,
    close: () => void,
    surrender: () => void,
    pause: () => void,
}

const InGameMenu: React.FC<IInGameMenu> = ({isBotMatch, close, surrender, pause}) => {

    return (
            <div className="in-game-menu flex column jc-c ai-c">
                {isBotMatch &&
                <div className="button in-game-menu-button" onClick={pause}>
                    Pause Game
                </div>}
                <div className="button in-game-menu-button" onClick={surrender}>
                    {isBotMatch ? 'End Game' : 'Surrender'}
                </div>
                <div className="button in-game-menu-button" onClick={close}>Back to Game</div>
            </div>
    );
};

export default InGameMenu;
