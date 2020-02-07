import React, {useEffect, useState} from 'react';
import './Board.scss';
import Card from './Card';

function Board() {

    const [count, setCount] = useState(0);
    const [fruit] = useState('banana');

    useEffect(() => {
        console.log('hey');
        //incCount();
        document.title = `You clicked ${count} times`;
    }, [count]);

    function incCount() {
        setCount(42);
    }

    return (
        <div className="board">
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
            <p>I like to eat {fruit}</p>
          <Card/>
        </div>
    );
}

export default Board;
