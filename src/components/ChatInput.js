import React, { useState, useRef, useEffect } from 'react';
import './ChatInput.css';
import { DETECTION_TYPES } from '../utils/moodDetection/constants';

function ChatInput({ onMoodSubmit, lastInput }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Prepopulate with last input if available
  useEffect(() => {
    if (lastInput && typeof lastInput === 'string') {
      // If there's a saved chat message, add it to history
      const savedMessage = {
        text: lastInput,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      setChatHistory([savedMessage]);
    }
  }, [lastInput]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!currentMessage.trim()) return;
    
    // Add user message to chat
    const newMessage = {
      text: currentMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setChatHistory((prev) => [...prev, newMessage]);
    setCurrentMessage('');
    
    // Send to parent for mood detection
    onMoodSubmit(currentMessage, DETECTION_TYPES.CHAT);
    
    // Simulate AI response (in a real app, this would come from actual AI response)
    simulateResponse();
  };

  const simulateResponse = () => {
    setIsTyping(true);
    
    setTimeout(() => {
      const botResponses = [
        "I'll find music that matches your mood!",
        "Let me find some tunes that might help with that.",
        "I understand how you're feeling. Let's find you some music.",
        "Thanks for sharing. I'll recommend some tracks based on your mood.",
        "Got it! Finding the perfect playlist for your current state.",
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage = {
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      
      setChatHistory((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat with Moodify</h3>
        <p>Tell me how you're feeling today</p>
      </div>
      
      <div className="chat-messages">
        {chatHistory.length === 0 ? (
          <div className="welcome-message">
            <p>👋 Hi there! I'm your Moodify assistant.</p>
            <p>Tell me how you're feeling or what kind of day you're having, and I'll recommend music to match your mood.</p>
          </div>
        ) : (
          <>
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-bubble">
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </>
        )}
        
        {isTyping && (
          <div className="chat-message bot-message">
            <div className="message-bubble typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>
      
      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="How are you feeling today?"
          aria-label="Chat message"
        />
        <button type="submit" disabled={!currentMessage.trim()}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
}

export default ChatInput;
