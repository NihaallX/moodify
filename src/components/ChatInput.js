import React, { useState, useRef, useEffect } from 'react';
import './ChatInput.css';
import { DETECTION_TYPES } from '../utils/moodDetection/constants';

/**
 * ChatInput
 * Provides a simple chat interface. The user types how they feel,
 * the message goes to the Groq detector in App.js, and the reply
 * is fed back here as `conversationalReply` to show in the chat.
 */
function ChatInput({
  onMoodSubmit,
  lastInput,
  currentMood,
  conversationalReply
}) {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef(null);

  // Pre-populate with last saved input on mount
  useEffect(() => {
    if (lastInput && typeof lastInput === 'string') {
      const alreadyExists = chatHistory.some(
        m => m.text === lastInput && m.sender === 'user'
      );
      if (!alreadyExists) {
        setChatHistory(prev => [
          ...prev,
          { text: lastInput, sender: 'user', timestamp: new Date().toISOString() }
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastInput]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // When a conversationalReply arrives (Groq response), append it as a bot message
  useEffect(() => {
    if (!conversationalReply || !currentMood) return;

    // Only add if not already the last bot message
    const last = chatHistory[chatHistory.length - 1];
    if (last?.sender === 'bot' && last?.text === conversationalReply) return;

    const botMsg = {
      text: conversationalReply,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      moodBadge: currentMood
    };
    setChatHistory(prev => [...prev, botMsg]);
    setIsTyping(false);
    setIsProcessing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationalReply, currentMood]);

  // Reset chat on full parent reset
  useEffect(() => {
    if (!currentMood && !lastInput) {
      setChatHistory([]);
      setIsTyping(false);
      setIsProcessing(false);
    }
  }, [currentMood, lastInput]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim() || isProcessing) return;

    const userMsg = {
      text: currentMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    setChatHistory(prev => [...prev, userMsg]);
    const text = currentMessage;
    setCurrentMessage('');
    setIsTyping(true);
    setIsProcessing(true);

    try {
      await onMoodSubmit(text, DETECTION_TYPES.CHAT);
      // bot reply will arrive via the conversationalReply effect above
    } catch (error) {
      console.error('Mood detection error:', error);
      setChatHistory(prev => [
        ...prev,
        {
          text: "Sorry, something went wrong. Give it another try!",
          sender: 'bot',
          timestamp: new Date().toISOString(),
          isError: true
        }
      ]);
      setIsTyping(false);
      setIsProcessing(false);
    }
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
            <p>👋 Hi! I'm your Moodify assistant.</p>
            <p>Tell me how you're feeling and I'll find songs to match your mood.</p>
          </div>
        ) : (
          chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <div className={`message-bubble ${msg.moodBadge ? 'mood-response' : ''}`}>
                {msg.moodBadge && (
                  <div className="mood-badge-container">
                    <div className="mood-badge">{msg.moodBadge}</div>
                    <div className="ai-badge" title="Powered by Groq AI">
                      ⚡ Groq
                    </div>
                  </div>
                )}
                <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="chat-message bot-message">
            <div className="message-bubble typing-indicator">
              <span /><span /><span />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={currentMessage}
          onChange={e => setCurrentMessage(e.target.value)}
          placeholder="How are you feeling today?"
          aria-label="Chat message"
          disabled={isProcessing}
        />
        <button
          type="submit"
          disabled={!currentMessage.trim() || isProcessing}
          className={isProcessing ? 'processing' : ''}
        >
          {isProcessing ? (
            <div className="button-spinner" />
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}

export default ChatInput;
