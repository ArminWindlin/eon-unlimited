import React from 'react';
import './Display.scss';

interface IInGameMenu {
    close: () => void,
    surrender: () => void
}

const InGameMenu: React.FC<IInGameMenu> = ({close, surrender}) => {

    return (
        <div className="in-game-menu flex column jc-c ai-c">
            <div className="button in-game-menu-button" onClick={surrender}>Surrender</div>
            <div className="button in-game-menu-button" onClick={close}>Back to Game</div>
        </div>
    );
};

export default InGameMenu;
