import React, {useEffect, useState} from 'react';
import './EnemyBoard.scss';
import Card from '../Card/Card';
import CardType from '../../../interfaces/CardType';

const EnemyBoard: React.FC = () => {

    const [cards, setCards] = useState<CardType[]>([]);

    useEffect(() => {
        window.$socket.on('UPDATE_ENEMY_BOARD', (data: CardType[]) => {
            setCards(data);
        });
        return () => {
            delete window.$socket._callbacks['$UPDATE_ENEMY_BOARD'];
        };
    }, []);

    return (
            <div className="enemy-board">
                <div className="enemy-board-card-container flex jc-c ai-c">
                    {cards.map((card, i) => {
                        return <Card card={card} draggable={false} key={i} onBoard={true}/>;
                    })}
                </div>
            </div>
    );
};

export default EnemyBoard;
