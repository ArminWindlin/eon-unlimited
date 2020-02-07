import React, {useEffect, useState} from 'react';
import './Board.scss';
import Card from './Card';
import Draggable from 'react-draggable';

function Board() {

    const [count, setCount] = useState(0);
    const [cardPosition, setCardPosition] = useState('relative');
    const [fruit] = useState('banana');

    useEffect(() => {
        console.log('hey');
        //incCount();
        document.title = `You clicked ${count} times`;
    }, [count]);

    function incCount() {
        setCount(42);
    }

    function onCardDragStop(e: any, position: any) {
        const {x, y} = position;
        console.log(x);
        console.log(y);
    }

    // @ts-ignore
    return (
        <div className="board">
            <Draggable>
                <div>This readme is really dragging on...</div>
            </Draggable>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
            <p>I like to eat {fruit}</p>
            <div className="card-container" id="card-container-1">
                <Draggable onStop={onCardDragStop}>
                    <div style={{position: 'relative'}}>
                        <Card/>
                    </div>
                </Draggable>
            </div>
            <div className="card-container" id="card-container-2">
                <Draggable>
                    <div>
                        <Card/>
                    </div>
                </Draggable>
            </div>
        </div>
    );
}

export default Board;
