import React, {useEffect, useState} from 'react';

const Register: React.FC = () => {

    const [name, setName] = useState('');

    useEffect(() => {
        let token = localStorage.getItem('token');
        window.$socket.emit('CONNECT_USER', token);
        window.$socket.on('CONNECT_ERROR', () => {
        });
    }, []);

    const register = () => {
        window.$socket.emit('REGISTER', name);
    };

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') register();
    };

    return (
        <div className="register flex column ai-c">
            <input className="register-name" placeholder={'Enter Username'} value={name}
                   onChange={e => setName(e.target.value)} onKeyDown={handleKeyDown}/>
            <div className="register-submit button button-blue" onClick={register}>Register</div>
        </div>
    );
};

export default Register;
