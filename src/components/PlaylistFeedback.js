import React, { useState } from 'react';
import './PlaylistFeedback.css';

const PlaylistFeedback = ({ mood, onFeedbackSubmit }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (type) => {
    setFeedbackType(type);
    setFeedbackGiven(true);
    
    if (type === 'negative') {
      setShowComment(true);
    } else {
      // For positive feedback, submit immediately
      await submitFeedback(type, '');
    }
  };

  const submitFeedback = async (type, userComment) => {
    setIsSubmitting(true);
    
    try {
      // Submit feedback via FormSubmit.co with proper CORS handling
      const formData = new FormData();
      formData.append('_subject', `Moodify Playlist Feedback - ${type === 'positive' ? '👍 Positive' : '👎 Negative'}`);
      formData.append('_next', 'https://moodifyxd.vercel.app/'); // Redirect after submission
      formData.append('_captcha', 'false');
      formData.append('_template', 'table'); // Use table template for better formatting
      formData.append('mood_detected', mood);
      formData.append('feedback_type', type === 'positive' ? 'Thumbs Up - This helped!' : 'Thumbs Down - Not quite the mood');
      formData.append('user_comment', userComment || 'No additional comment');
      formData.append('timestamp', new Date().toLocaleString());
      formData.append('page_url', window.location.href);

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
      console.log('Feedback submitted successfully');
      if (onFeedbackSubmit) {
        onFeedbackSubmit(type, userComment);
      }
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('There was an error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    await submitFeedback('negative', comment);
    setShowComment(false);
  };

  if (feedbackGiven && !showComment) {
    return (
      <div className="playlist-feedback submitted">
        <div className="feedback-success">
          {feedbackType === 'positive' ? (
            <>
              <span className="feedback-icon">🎵</span>
              <p>Thanks! Glad we nailed your vibe! ✨</p>
            </>
          ) : (
            <>
              <span className="feedback-icon">📝</span>
              <p>Thanks for the feedback! We'll keep improving! 💜</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="playlist-feedback">
      <div className="feedback-question">
        <p>Did we catch your mood right? 🎯</p>
      </div>
      
      {!showComment ? (
        <div className="feedback-buttons">
          <button 
            className="feedback-btn positive"
            onClick={() => handleFeedback('positive')}
            disabled={isSubmitting}
          >
            <span className="btn-icon">👍</span>
            <span className="btn-text">This helped!</span>
          </button>
          
          <button 
            className="feedback-btn negative"
            onClick={() => handleFeedback('negative')}
            disabled={isSubmitting}
          >
            <span className="btn-icon">👎</span>
            <span className="btn-text">Not quite the mood</span>
          </button>
        </div>
      ) : (
        <div className="feedback-comment-form">
          <form onSubmit={handleCommentSubmit}>
            <div className="comment-section">
              <label htmlFor="mood-comment">
                What mood were you actually feeling? Help us get better! 💭
              </label>
              <textarea
                id="mood-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Like... I was feeling more chill/sad/hyped/anxious... anything helps us improve! 🎵"
                rows="3"
                required
              />
            </div>
            
            <div className="comment-actions">
              <button 
                type="button" 
                onClick={() => setShowComment(false)}
                className="cancel-btn"
              >
                Skip for now
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="submit-btn"
              >
                {isSubmitting ? 'Sending...' : 'Send feedback ✨'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PlaylistFeedback;
