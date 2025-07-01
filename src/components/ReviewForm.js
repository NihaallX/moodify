import React, { useState } from 'react';
import './ReviewForm.css';

const ReviewForm = ({ isOpen, onClose }) => {
  const [review, setReview] = useState({
    rating: 5,
    name: '',
    email: '',
    message: '',
    mood: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Using FormSubmit.co - a free form handling service
      const formData = new FormData();
      formData.append('_subject', `Moodify Review - ${review.rating}/5 Stars`);
      formData.append('_next', window.location.href);
      formData.append('_captcha', 'false');
      formData.append('rating', `${review.rating}/5 stars`);
      formData.append('name', review.name || 'Anonymous');
      formData.append('email', review.email || 'Not provided');
      formData.append('message', review.message);
      formData.append('detected_mood', review.mood || 'Not specified');
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
          setReview({ rating: 5, name: '', email: '', message: '', mood: '' });
        }, 2000);
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }

    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="review-overlay">
      <div className="review-modal">
        <div className="review-header">
          <h2>✨ Rate Your Experience</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {submitted ? (
          <div className="review-success">
            <div className="success-icon">🎉</div>
            <h3>Thank you for your feedback! 💜</h3>
            <p>Your review helps us improve the experience for everyone! 🙏</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="review-form">
            <div className="rating-section">
              <label>How did we do? 🌟</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${star <= review.rating ? 'active' : ''}`}
                    onClick={() => setReview(prev => ({ ...prev, rating: star }))}
                  >
                    ⭐
                  </button>
                ))}
                <span className="rating-text">
                  {review.rating === 5 ? "Amazing! 🔥" : 
                   review.rating === 4 ? "Really good! 💫" :
                   review.rating === 3 ? "Pretty decent ✨" :
                   review.rating === 2 ? "Could be better 💭" : 
                   "Needs improvement �"}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>Your name (optional)</label>
              <input
                type="text"
                value={review.name}
                onChange={(e) => setReview(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label>Email (optional)</label>
              <input
                type="email"
                value={review.email}
                onChange={(e) => setReview(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label>Tell us more about your experience *</label>
              <textarea
                value={review.message}
                onChange={(e) => setReview(prev => ({ ...prev, message: e.target.value }))}
                placeholder="How was your experience with Moodify? Did the mood detection work well? Were the playlists a good match?"
                required
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={onClose} className="cancel-btn">
                Maybe later
              </button>
              <button type="submit" disabled={isSubmitting} className="submit-btn">
                {isSubmitting ? '📤 Sending feedback...' : '🚀 Submit review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewForm;
