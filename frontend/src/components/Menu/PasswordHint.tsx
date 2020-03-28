import React from 'react';
import './Menu.scss';

interface IPasswordHint {
    hintOnClick: () => void
}

const PasswordHint: React.FC<IPasswordHint> = ({hintOnClick}) => {

    return (
            <div className="password-hint" onClick={hintOnClick}>Please set your password!</div>
    );
};

export default PasswordHint;
