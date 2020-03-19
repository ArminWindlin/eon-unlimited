import React, {useState} from 'react';
import './Menu.scss';
import Settings from './Settings';

interface IMenu {
    searchMatch: () => void,
    logout: () => void
}

const Menu: React.FC<IMenu> = ({searchMatch, logout}) => {

    const [settingsOpened, setSettingsOpened] = useState(false);

    const toggleSettings = () => {
        setSettingsOpened(!settingsOpened);
    };

    return (
            <div className="menu flex ai-c jc-c">
                <div className="button menu-play-button" onClick={searchMatch}>PLAY</div>
                {settingsOpened && <Settings/>}
                <div className="button menu-settings-button" onClick={toggleSettings}>
                    {settingsOpened ? 'Close' : 'Settings'}
                </div>
                <div className="button menu-logout-button" onClick={logout}>
                    Logout
                </div>
            </div>
    );
};

export default Menu;
