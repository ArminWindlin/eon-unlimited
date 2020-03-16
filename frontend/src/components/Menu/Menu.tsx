import React, {useState} from 'react';
import './Menu.scss';
import Settings from './Settings';

interface IMenu {
    searchMatch: () => void
}

const Menu: React.FC<IMenu> = ({searchMatch}) => {

    const [settingsOpened, setSettingsOpened] = useState(true);

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
            </div>
    );
};

export default Menu;
