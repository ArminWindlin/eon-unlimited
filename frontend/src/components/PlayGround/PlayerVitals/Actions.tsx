import React, {useEffect, useState} from 'react';
import './PlayerVitals.scss';
import {socket} from '../../../utility/socket';

const Actions: React.FC = () => {

    const [actions, setActions] = useState(6);

    useEffect(() => {
        socket.on('UPDATE_ACTIONS', (data: number) => {
            setActions(data);
        });
    }, []);

    return (
            <div className="actions">{actions}</div>
    );
};

export default Actions;
