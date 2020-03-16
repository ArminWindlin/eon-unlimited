import React, {useState} from 'react';
import './Menu.scss'

interface IMenu {
    searchMatch: () => void
}

const Menu: React.FC<IMenu> = ({searchMatch}) => {

    return (
        <div className="menu flex ai-c jc-c">
            <div className="button menu-play-button" onClick={searchMatch}>PLAY</div>
            <div className="button menu-settings-button">Settings</div>
        </div>
    );
};

export default Menu;
