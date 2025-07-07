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
      // Using FormSubmit.co with proper CORS handling
      const formData = new FormData();
      formData.append('_subject', `Moodify AI Access Request - ${message.subject}`);
      formData.append('_next', 'https://moodifyxd.vercel.app/'); // Redirect after submission
      formData.append('_captcha', 'false');
      formData.append('_template', 'table'); // Use table template for better formatting
      formData.append('name', message.name || 'Anonymous');
      formData.append('email', message.email || 'Not provided');
      formData.append('subject', message.subject);
      formData.append('message', message.content);
      formData.append('request_type', 'AI Access Request');
      formData.append('timestamp', new Date().toLocaleString());

      // Create a hidden form and submit it instead of using fetch
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://formsubmit.co/nihalpardeshi12344@gmail.com';
      form.style.display = 'none';
      
      // Add all form data as hidden inputs
      for (let [key, value] of formData.entries()) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }
      
      document.body.appendChild(form);
      form.submit();
      
      // Show success message immediately since we can't wait for response
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
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert('There was an error sending your message. Please try again or contact nihalpardeshi12344@gmail.com directly.');
    } finally {
      setIsSubmitting(false);
    }
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
