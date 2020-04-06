import React, {useEffect, useState} from 'react';
import './PlayerVitals.scss';

const Actions: React.FC = () => {

    const [actions, setActions] = useState(6);

    useEffect(() => {
        window.$socket.on('UPDATE_ACTIONS', (data: number) => {
            setActions(data);
        });
        return () => {
            delete window.$socket._callbacks['$UPDATE_ACTIONS'];
        };
    }, []);

    return (
            <div className="actions">{actions}</div>
    );
};

export default Actions;
