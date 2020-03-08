import React, {useState, useEffect} from 'react';
import './Chat.scss';

const Chat: React.FC = () => {

    const [messages, setMessages] = useState<string[]>([]);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        socketSetup();
    }, []);

    function socketSetup() {
        window.$socket.on('UPDATE_GLOBAL_MESSAGES', (data: string) => {
            messages.push(data);
            setMessages([...messages]);
        });
    }

    function sendMessage(e: any) {
        e.preventDefault();
        window.$socket.emit('POST_GLOBAL_MESSAGE', message);
        setMessage('');
    }

    const handleChange = (event: any) => {
        setMessage(event.target.value);
    };

    return (
        <div className="chat">
            <div className="chat-container">
                {messages.map((message, i) => {
                    return <div key={i}>{message}</div>;
                })}
            </div>
            <form onSubmit={sendMessage} className="chat-form">
                <input type="text" name="message" value={message} onChange={handleChange}/>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    );
};

export default Chat;
