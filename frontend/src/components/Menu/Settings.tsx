import React, {useState} from 'react';
import './Menu.scss';

const Settings: React.FC = () => {

    const [newPassword, setNewPassword] = useState('');

    const updatePassword = () => {
        window.$socket.emit('PUT_PASSWORD', newPassword);
    };

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') updatePassword();
    };

    return (
            <div className="settings border-default flex column ai-c">
                <input placeholder="New Password" value={newPassword} type="password"
                       onChange={e => setNewPassword(e.target.value)} onKeyDown={handleKeyDown}/>
                <div className="button settings-button" onClick={updatePassword}>Change Password</div>
            </div>
    );
};

export default Settings;
