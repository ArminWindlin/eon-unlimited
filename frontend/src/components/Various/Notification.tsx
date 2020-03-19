import React, {useEffect, useState} from 'react';
import './Notification.scss'

const Notification: React.FC = () => {

    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');

    useEffect(() => {
        window.$socket.on('ERROR', (data: string) => {
            setType('error');
            setMessage(data);
            setTimeout(() => setMessage(''), 3000);
        });
        window.$socket.on('INFO', (data: string) => {
            setType('info');
            setMessage(data);
            setTimeout(() => setMessage(''), 3000);
        });
    }, []);

    return (
            <div>
                {message !== '' && <div className={'notification ' + type}>{message}</div>}
            </div>
    );
};

export default Notification;
