import React, {useEffect, useState} from 'react';
import './PlayerVitals.scss';
import {socket} from '../../../utility/socket';

const Life: React.FC = () => {

    const [life, setLife] = useState(100);

    useEffect(() => {
        socket.on('UPDATE_LIFE', (data: number) => {
            setLife(data);
        });
    }, []);

    return (
            <div className="life">{life}</div>
    );
};

export default Life;
