import React, {useEffect, useState} from 'react';
import './Hand.scss';
import Card from '../Card/Card';
import CardType from '../../../interfaces/CardType';

const Hand: React.FC = () => {

    const [cards, setCards] = useState<CardType[]>([]);

    useEffect(() => {
        window.$socket.on('UPDATE_HAND', (data: CardType[]) => {
            setCards(data);
        });
        return () => {
            delete window.$socket._callbacks['$UPDATE_HAND'];
        };
    }, []);

    return (
            <div className="hand">
                <div className="hand-card-container flex jc-c ai-c">
                    {cards.map((card, i) => {
                        return <Card card={card} draggable={true} key={i}/>;
                    })}
                </div>
            </div>
    );
};

export default Hand;
