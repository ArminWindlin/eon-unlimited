import React, {useEffect} from 'react';
import './MatchMaking.scss';

const MatchMaking: React.FC = () => {

    useEffect(() => {
        window.$socket.emit('MATCH_SEARCH');
    }, []);

    return (
        <div className="match-making">
            <div className="match-making-info">
                Waiting for opponent...
            </div>
        </div>
    );
};

export default MatchMaking;
