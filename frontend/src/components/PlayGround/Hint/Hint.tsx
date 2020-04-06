import React, {useEffect, useState} from 'react';
import './Hint.scss';

const Hint: React.FC = () => {

    const [hint, setHint] = useState('');
    const [timer, setTimer] = useState<any>(null);

    useEffect(() => {
        window.$socket.on('SHOW_HINT', (data: string) => {
            setHint(data);
            const timeout = setTimeout(() => setHint(''), 1500);
            setTimer(timeout);
        });
        return () => {
            if (timer) clearTimeout(timer);
            delete window.$socket._callbacks['$SHOW_HINT'];
        };
    });

    return (
            <div className="hint">{hint}</div>
    );
};

export default Hint;
