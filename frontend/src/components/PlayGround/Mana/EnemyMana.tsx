import React, {useEffect, useState} from 'react';
import './Mana.scss';
import {socket} from '../../../utility/socket';

const EnemyMana: React.FC = () => {

    const [mana, setMana] = useState(20);

    useEffect(() => {
        socket.on('UPDATE_ENEMY_MANA', (data: number) => {
            setMana(data);
        });
    }, []);

    return (
            <div className="mana enemy">{mana}</div>
    );
};

export default EnemyMana;
