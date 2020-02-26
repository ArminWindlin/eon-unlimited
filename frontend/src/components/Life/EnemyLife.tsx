import React, {useEffect, useState} from 'react';
import './EnemyLife.scss';
import {socket} from '../../utility/socket';

const Life: React.FC = () => {

    const [life, setLife] = useState(100);

    useEffect(() => {
        socket.on('UPDATE_ENEMY_LIFE', (data: number) => {
            setLife(data);
        });
    }, []);

    const attack = () => {
        socket.emit('ACTION_ATTACK_PLAYER');
    };

    return (
            <div className="enemy-life clickable" onClick={attack}>{life}</div>
    );
};

export default Life;
