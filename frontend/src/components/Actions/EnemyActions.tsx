import React, {useEffect, useState} from 'react';
import './Actions.scss';
import {socket} from '../../utility/socket';

const EnemyActions: React.FC = () => {

    const [actions, setActions] = useState(6);

    useEffect(() => {
        socket.on('UPDATE_ENEMY_ACTIONS', (data: number) => {
            setActions(data);
        });
    }, []);

    return (
            <div className="actions enemy">{actions}</div>
    );
};

export default EnemyActions;
