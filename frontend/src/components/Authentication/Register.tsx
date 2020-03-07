import React, {useEffect, useState} from 'react';
import {socket} from '../../utility/socket';

const Register: React.FC = () => {

    const [name, setName] = useState('');

    useEffect(() => {
        let token = localStorage.getItem('token');
        socket.emit('CONNECT_USER', token);
        socket.on('CONNECT_ERROR', () => {
        });
    }, []);

    const register = () => {
        socket.emit('REGISTER', name);
    };

    return (
        <div className="register flex column ai-c">
            <input className="register-name" placeholder={'Enter Username'} value={name}
                   onChange={e => setName(e.target.value)}/>
            <div className="register-submit button button-blue" onClick={register}>Register</div>
        </div>
    );
};

export default Register;
