import React, {useEffect, useState} from 'react';
import './PlayerVitals.scss';

const Life: React.FC = () => {

    const [life, setLife] = useState(100);

    useEffect(() => {
        window.$socket.on('UPDATE_ENEMY_LIFE', (data: number) => {
            setLife(data);
        });
        return () => {
            delete window.$socket._callbacks['$UPDATE_ENEMY_LIFE'];
        };
    }, []);

    const attack = () => {
        window.$socket.emit('ACTION_ATTACK_PLAYER');
    };

    return (
            <div className="life enemy clickable" onClick={attack}>{life}</div>
    );
};

export default Life;
