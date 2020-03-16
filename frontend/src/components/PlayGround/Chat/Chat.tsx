import React, {useEffect, useState} from 'react';
import './Chat.scss';

interface Message {
    text: string,
    sender: string
}

const Chat: React.FC = () => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        if (!window.$socket._callbacks['$UPDATE_GAME_CHAT'])
            window.$socket.on('UPDATE_GAME_CHAT', (data: Message) => {
                addMessage(data);
            });
        return () => {
            delete window.$socket._callbacks['$UPDATE_GAME_CHAT'];
        };
    });

    const sendMessage = (e: any) => {
        e.preventDefault();
        window.$socket.emit('POST_GAME_CHAT', message);
        addMessage({text: message, sender: window.$name});
        setMessage('');
    };

    const addMessage = (message: Message) => {
        messages.push(message);
        if (messages.length > 5) messages.splice(0, 1);
        setMessages([...messages]);
    };

    const handleChange = (event: any) => {
        setMessage(event.target.value);
    };

    return (
            <div className="chat">
                <div className="chat-container">
                    {messages.map((message, i) => {
                        return <div key={i}
                                    className={`chat-message ${message.sender === window.$name ? 'align-right' : ''}`}>
                            <div className="chat-message-sender">{message.sender}</div>
                            <div className="chat-message-text">{message.text}</div>
                        </div>;
                    })}
                </div>
                <form onSubmit={sendMessage} className="chat-form flex ai-c" autoComplete="off">
                    <input type="text" name="message" value={message} onChange={handleChange}/>
                    <button type="submit" value="Submit" className="button">Send</button>
                </form>
            </div>
    );
};

export default Chat;
