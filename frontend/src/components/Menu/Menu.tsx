import React, {useEffect, useState} from 'react';
import './Menu.scss';
import Settings from './Settings';
import PasswordHint from './PasswordHint';

interface IMenu {
    searchMatch: () => void,
    logout: () => void,
    startTestMatch: () => void,
}

const Menu: React.FC<IMenu> = ({searchMatch, logout, startTestMatch}) => {

    const [displayPasswordHint, setDisplayPasswordHint] = useState(false);

    useEffect(() => {
        if (!window.$user.passwordSet) setDisplayPasswordHint(true);
    }, []);

    const [settingsOpened, setSettingsOpened] = useState(false);

    const toggleSettings = () => {
        setSettingsOpened(!settingsOpened);
    };

    const hintOnClick = () => {
        setSettingsOpened(true);
        // TODO: only make hint disappear when password is actually updated
        setDisplayPasswordHint(false);
    };

    return (
            <div className="menu flex column ai-c jc-c">
                <div className="button menu-play-button" onClick={searchMatch}>MULTIPLAYER</div>
                <div className="button menu-play-button" onClick={startTestMatch}>SINGLEPLAYER</div>
                {settingsOpened && <Settings/>}
                <div className="button menu-settings-button" onClick={toggleSettings}>
                    {settingsOpened ? 'Close' : 'Settings'}
                </div>
                <div className="button menu-logout-button" onClick={logout}>
                    Logout
                </div>
                {displayPasswordHint && <PasswordHint hintOnClick={hintOnClick}/>}
            </div>
    );
};

export default Menu;
