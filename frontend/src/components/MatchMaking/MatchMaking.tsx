import React, {useEffect} from 'react';
import './MatchMaking.scss';

interface IMatchMaking {
    toMenu: () => void
}

const MatchMaking: React.FC<IMatchMaking> = ({toMenu}) => {

    useEffect(() => {
        window.$socket.emit('MATCH_SEARCH');
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', e => {
            if (e.code === 'Escape') {
                window.$socket.emit('MATCH_SURRENDER');
                toMenu();
            }
        });
    }, [toMenu]);

    return (
            <div className="match-making">
                <div className="match-making-info">
                    Waiting for opponent...
                </div>
            </div>
    );
};

export default MatchMaking;
