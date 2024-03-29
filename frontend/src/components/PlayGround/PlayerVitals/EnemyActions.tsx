import React, {useEffect, useState} from 'react';
import './PlayerVitals.scss';

const EnemyActions: React.FC = () => {

    const [actions, setActions] = useState(6);

    useEffect(() => {
        window.$socket.on('UPDATE_ENEMY_ACTIONS', (data: number) => {
            setActions(data);
        });
        return () => {
            delete window.$socket._callbacks['$UPDATE_ENEMY_ACTIONS'];
        };
    }, []);

    return (
            <div className="actions enemy">{actions}</div>
    );
};

export default EnemyActions;
