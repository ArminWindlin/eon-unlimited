import React, {useEffect, useState} from 'react';
import './Hint.scss';

const Hint: React.FC = () => {

    const [hint, setHint] = useState('');

    useEffect(() => {
        window.$socket.on('SHOW_HINT', (data: string) => {
            setHint(data);
            setTimeout(() => setHint(''), 1500);
        });
    }, []);

    return (
            <div className="hint">{hint}</div>
    );
};

export default Hint;
