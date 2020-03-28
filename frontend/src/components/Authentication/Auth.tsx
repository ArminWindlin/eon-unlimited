import React, {useState} from 'react';
import Register from './Register';
import Login from './Login';
import './Authentication.scss';

const Auth: React.FC = () => {

    const [loginActive, setLoginActive] = useState(false);

    const toggleAuth = () => {
        setLoginActive(!loginActive);
    };

    return (
        <div className="auth">
            {loginActive && <Login/>}
            {!loginActive && <Register/>}
            <div className="auth-change clickable" onClick={toggleAuth}>
                {loginActive ? 'No Account?' : 'Already have an account?'}
                </div>
        </div>
    );
};

export default Auth;
