import React, {useEffect, useState} from 'react';
import './PlayerVitals.scss';

const EnemyMana: React.FC = () => {

    const [mana, setMana] = useState(20);

    useEffect(() => {
        window.$socket.on('UPDATE_ENEMY_MANA', (data: number) => {
            setMana(data);
        });
        return () => {
            delete window.$socket._callbacks['$UPDATE_ENEMY_MANA'];
        };
    }, []);

    return (
            <div className="mana enemy">{mana}</div>
    );
};

export default EnemyMana;
