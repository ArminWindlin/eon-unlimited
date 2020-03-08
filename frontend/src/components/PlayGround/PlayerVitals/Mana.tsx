import React, {useEffect, useState} from 'react';
import './PlayerVitals.scss';

const Mana: React.FC = () => {

    const [mana, setMana] = useState(20);

    useEffect(() => {
        window.$socket.on('UPDATE_MANA', (data: number) => {
            setMana(data);
        });
    }, []);

    return (
            <div className="mana">{mana}</div>
    );
};

export default Mana;
