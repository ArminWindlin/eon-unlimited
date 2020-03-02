import React, {useEffect, useState} from 'react';
import './Mana.scss';
import {socket} from '../../utility/socket';

const Mana: React.FC = () => {

    const [mana, setMana] = useState(20);

    useEffect(() => {
        socket.on('UPDATE_MANA', (data: number) => {
            setMana(data);
        });
    }, []);

    return (
            <div className="mana">{mana}</div>
    );
};

export default Mana;
