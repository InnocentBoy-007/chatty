import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export default function Homepage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    // Connect to WebSocket server
    socketRef.current = io(import.meta.env.VITE_API_URL);

    // Handle incoming messages
    socketRef.current.on('receive_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socketRef.current.emit('send_message', {
        text: newMessage,
        timestamp: new Date().toLocaleTimeString()
      });
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <div className="bg-blue-100 rounded-lg p-2 max-w-[70%]">
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}
