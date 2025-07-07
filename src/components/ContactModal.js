import React, { useState } from 'react';
import './ContactModal.css';

const ContactModal = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState({
    name: '',
    email: '',
    subject: 'Interest in Moodify AI Full Version',
    content: 'Hey Nihal, I\'m interested in the full AI version of Moodify!'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Using FormSubmit.co - same service as reviews
      const formData = new FormData();
      formData.append('_subject', `Moodify AI Access Request - ${message.subject}`);
      formData.append('_next', window.location.href);
      formData.append('_captcha', 'false');
      formData.append('name', message.name || 'Anonymous');
      formData.append('email', message.email || 'Not provided');
      formData.append('subject', message.subject);
      formData.append('message', message.content);
      formData.append('request_type', 'AI Access Request');
      formData.append('timestamp', new Date().toLocaleString());

      const response = await fetch('https://formsubmit.co/nihalpardeshi12344@gmail.com', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
          setSubmitted(false);
          setMessage({
            name: '',
            email: '',
            subject: 'Interest in Moodify AI Full Version',
            content: 'Hey Nihal, I\'m interested in the full AI version of Moodify!'
          });
        }, 2000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }

    setIsSubmitting(false);
  };

  const handleInputChange = (field, value) => {
    setMessage(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="contact-overlay" onClick={onClose}>
      <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
        <div className="contact-header">
          <h2>🤖 Get AI Access</h2>
          <button className="contact-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="contact-content">
          {submitted ? (
            <div className="contact-success">
              <div className="success-icon">🚀</div>
              <h3>Message Sent!</h3>
              <p>Thanks for your interest! Nihaall will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Your Name (Optional)</label>
                <input
                  type="text"
                  value={message.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label>Your Email (Optional)</label>
                <input
                  type="email"
                  value={message.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  value={message.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={message.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Let Nihal know you're interested in the full AI version..."
                  rows="4"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="contact-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <span>📧</span>
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
