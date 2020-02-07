import React, {useEffect, useState} from 'react';

function Board() {

    const [count, setCount] = useState(0);
    const [fruit] = useState('banana');

    useEffect(() => {
        document.title = `You clicked ${count} times`;
    });

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
            <p>I like to eat {fruit}</p>
        </div>
    );
}

export default Board;
