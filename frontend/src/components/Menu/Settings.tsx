import React from 'react';
import './Menu.scss'

const Settings: React.FC = () => {

    return (
        <div className="settings border-default flex column ai-c">
            <input placeholder="New Password"/>
            <div className="button settings-button">Change Password</div>
        </div>
    );
};

export default Settings;
