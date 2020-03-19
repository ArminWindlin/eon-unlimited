import React, {useState} from 'react';

const Login: React.FC = () => {

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const login = () => {
        window.$socket.emit('LOGIN', {
            userName: name,
            password: password,
        });
    };

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') login();
    };

    return (
            <div className="login flex column ai-c">
                <input className="login-name" placeholder={'Enter Username'} value={name}
                       onChange={e => setName(e.target.value)} onKeyDown={handleKeyDown}/>
                <input className="login-password" placeholder={'Enter Password'} value={password} type="password"
                       onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown}/>
                <div className="login-submit button" onClick={login}>Login</div>
            </div>
    );
};

export default Login;
