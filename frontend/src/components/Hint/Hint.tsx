import React from 'react';
import './Hint.scss';

interface HintProps {
    hint: string,
}

const Hint: React.FC<HintProps> = ({hint}) => {
    return (
        <div className="hint">{hint}</div>
    );
};

export default Hint;
