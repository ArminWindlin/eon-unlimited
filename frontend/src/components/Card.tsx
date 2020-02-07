import React, {useEffect, useState} from 'react';
import './Card.scss';

function Card() {

    const [title, setTitle] = useState('');

    useEffect(() => {
        setTitle('card');
    }, []);

    return (
        <div className="card">{title}</div>
    );
}

export default Card;
