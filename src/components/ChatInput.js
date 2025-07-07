import React, { useState, useRef, useEffect } from 'react';
import './ChatInput.css';
import { DETECTION_TYPES } from '../utils/moodDetection/constants';
import { generateFollowUpQuestion, detectPositiveIntent } from '../utils/moodDetection/conversationalReply';

function ChatInput({ 
  onMoodSubmit, 
  lastInput, 
  currentMood, 
  conversationalReply, 
  awaitingPlaylistConfirmation, 
  onPlaylistConfirmation 
}) {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Track API processing state
  const [hasAddedFollowUp, setHasAddedFollowUp] = useState(false); // Track if follow-up question was added
  const chatEndRef = useRef(null);

  // Prepopulate with last input if available
  useEffect(() => {
    if (lastInput && typeof lastInput === 'string') {
      // Check if this message is already in the history to avoid duplicates
      const messageExists = chatHistory.some(msg => 
        msg.text === lastInput && msg.sender === 'user'
      );
      
      if (!messageExists) {
        // If there's a saved chat message, add it to history
        const savedMessage = {
          text: lastInput,
          sender: 'user',
          timestamp: new Date().toISOString()
        };
        setChatHistory(prev => [...prev, savedMessage]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastInput]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Add follow-up question when mood is detected and we're awaiting confirmation
  useEffect(() => {
    if (currentMood && conversationalReply && awaitingPlaylistConfirmation && !hasAddedFollowUp) {
      const followUpQuestion = generateFollowUpQuestion(currentMood);
      
      const botMessage = {
        text: followUpQuestion,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isFollowUp: true
      };
      
      setChatHistory(prev => [...prev, botMessage]);
      setHasAddedFollowUp(true);
    }
  }, [currentMood, conversationalReply, awaitingPlaylistConfirmation, hasAddedFollowUp]);

  // Reset chat state when parent resets, but preserve chat history unless explicitly cleared
  useEffect(() => {
    if (!currentMood && !awaitingPlaylistConfirmation) {
      setHasAddedFollowUp(false);
      // Only clear chat history if lastInput is also null (complete reset)
      if (!lastInput) {
        setChatHistory([]);
      }
    }
  }, [currentMood, awaitingPlaylistConfirmation, lastInput]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!currentMessage.trim() || isProcessing) return;
    
    // Add user message to chat
    const newMessage = {
      text: currentMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setChatHistory((prev) => [...prev, newMessage]);
    const userMessageText = currentMessage;
    setCurrentMessage('');
    
    // Check if this is a response to a follow-up question
    if (awaitingPlaylistConfirmation) {
      // User is responding to playlist confirmation question
      const wantsPlaylists = detectPositiveIntent(userMessageText);
      
      // Add bot response about their choice
      const confirmationResponse = wantsPlaylists 
        ? "Perfect! I'll pull up some great playlists for you right now. 🎵\n\nCheck out the playlist recommendations below! 👇"
        : "No worries! Feel free to chat with me anytime about how you're feeling. 😊";
      
      const botMessage = {
        text: confirmationResponse,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isConfirmation: true,
        playlistsShown: wantsPlaylists
      };
      
      setChatHistory((prev) => [...prev, botMessage]);
      
      // Notify parent component about the user's decision
      onPlaylistConfirmation(wantsPlaylists);
      
      return; // Don't process this as a new mood detection
    }
    
    // This is initial mood detection
    setIsTyping(true);
    setIsProcessing(true);
    
    try {
      // Send to parent for mood detection
      await onMoodSubmit(userMessageText, DETECTION_TYPES.CHAT);
      
      // Add AI response after mood has been processed
      simulateResponse();
    } catch (error) {
      console.error('Error processing mood:', error);
      
      // Add error message to chat
      const errorMessage = {
        text: "Sorry, I didn't catch that. Try again?",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setChatHistory((prev) => [...prev, errorMessage]);
      setIsTyping(false);
      setIsProcessing(false);
    }
  };

  const simulateResponse = () => {
    // Wait a brief moment to make the interaction feel more natural
    setTimeout(() => {
      // Use conversational reply if available, otherwise use fallback
      const responseText = conversationalReply || "I understand how you're feeling. Let me analyze that for you.";
      
      const botMessage = {
        text: responseText,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isMoodResponse: true,
        moodBadge: currentMood, // Include the detected mood as a badge
        isAiEnhanced: !!conversationalReply // Show AI badge if we have a conversational reply
      };
      
      setChatHistory((prev) => [...prev, botMessage]);
      setIsTyping(false);
      setIsProcessing(false);
      
      // Reset the follow-up state for next interaction
      setHasAddedFollowUp(false);
    }, 800);
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
                <div className={`message-bubble ${msg.isMoodResponse ? 'mood-response' : ''} ${msg.isFollowUp ? 'follow-up' : ''} ${msg.isConfirmation ? 'confirmation' : ''}`}>
                  {msg.moodBadge && (
                    <div className="mood-badge-container">
                      <div className="mood-badge">{msg.moodBadge}</div>
                      {msg.isAiEnhanced && (
                        <div className="ai-badge" title="Enhanced by two-layer AI detection">
                          🧠 AI
                        </div>
                      )}
                    </div>
                  )}
                  <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
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
          placeholder={awaitingPlaylistConfirmation ? "Yes, please! or No thanks..." : "How are you feeling today?"}
          aria-label="Chat message"
          disabled={isProcessing}
        />
        <button 
          type="submit" 
          disabled={!currentMessage.trim() || isProcessing}
          className={isProcessing ? 'processing' : ''}
        >
          {isProcessing ? (
            <div className="button-spinner"></div>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}

export default ChatInput;
