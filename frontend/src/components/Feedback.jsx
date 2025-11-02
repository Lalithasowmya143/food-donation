import React, { useState, useEffect } from 'react';

function Feedback({ token, user }) {
  const [activeTab, setActiveTab] = useState('submit');
  const [allFeedback, setAllFeedback] = useState([]);
  const [myFeedback, setMyFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    rating: 5,
    message: ''
  });

  // ✅ Use deployed backend URL
  const API_BASE_URL = 'https://food-donation-5gz1.onrender.com';

  useEffect(() => {
    if (activeTab === 'view-all') {
      fetchAllFeedback();
    } else if (activeTab === 'my-feedback') {
      fetchMyFeedback();
    }
  }, [activeTab, token]); // Added token as dependency

  const fetchAllFeedback = async () => {
    setLoading(true);
    try {
      // ✅ Updated to use the deployed API URL
      const response = await fetch(`${API_BASE_URL}/api/feedback`);
      const data = await response.json();
      setAllFeedback(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
    setLoading(false);
  };

  const fetchMyFeedback = async () => {
    setLoading(true);
    try {
      // ✅ Updated to use the deployed API URL
      const response = await fetch(`${API_BASE_URL}/api/feedback/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMyFeedback(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // ✅ Updated to use the deployed API URL
      const response = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('Thank you for your feedback!');
        setFormData({ rating: 5, message: '' });
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to submit feedback');
      }
    } catch (error) {
      setMessage('Server error. Please try again.');
    }
    setLoading(false);
  };

  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'star filled' : 'star'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const renderInteractiveStars = (currentRating) => {
    return (
      <div className="star-rating interactive">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= currentRating ? 'star filled' : 'star'}
            onClick={() => setFormData({ ...formData, rating: star })}
            style={{ cursor: 'pointer' }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="feedback-page">
      <div className="feedback-header">
        <h1>Feedback</h1>
        <p>Share your experience and help us improve</p>
      </div>

      <div className="feedback-tabs">
        <button
          className={activeTab === 'submit' ? 'tab-active' : ''}
          onClick={() => setActiveTab('submit')}
        >
          Submit Feedback
        </button>
        <button
          className={activeTab === 'view-all' ? 'tab-active' : ''}
          onClick={() => setActiveTab('view-all')}
        >
          All Feedback
        </button>
        <button
          className={activeTab === 'my-feedback' ? 'tab-active' : ''}
          onClick={() => setActiveTab('my-feedback')}
        >
          My Feedback
        </button>
      </div>

      <div className="feedback-content">
        {activeTab === 'submit' && (
          <div className="feedback-form-container">
            <h2>Submit Your Feedback</h2>
            {message && <div className="success-message">{message}</div>}

            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="form-group">
                <label>Your Rating</label>
                {renderInteractiveStars(formData.rating)}
                <p className="rating-text">
                  {formData.rating === 5 && 'Excellent'}
                  {formData.rating === 4 && 'Very Good'}
                  {formData.rating === 3 && 'Good'}
                  {formData.rating === 2 && 'Fair'}
                  {formData.rating === 1 && 'Poor'}
                </p>
              </div>

              <div className="form-group">
                <label>Your Feedback</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows="6"
                  placeholder="Tell us about your experience with FoodShare..."
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'view-all' && (
          <div className="feedback-list-container">
            <h2>Community Feedback</h2>
            {loading ? (
              <p>Loading...</p>
            ) : allFeedback.length === 0 ? (
              <p className="no-items">No feedback yet</p>
            ) : (
              <div className="feedback-grid">
                {allFeedback.map((feedback) => (
                  <div key={feedback._id} className="feedback-card">
                    <div className="feedback-header-card">
                      <div className="feedback-user-info">
                        <h3>{feedback.name}</h3>
                        <span className={`user-type-badge ${feedback.userType}`}>
                          {feedback.userType === 'donor' ? 'Donor' : 'Orphanage'}
                        </span>
                      </div>
                      {renderStars(feedback.rating)}
                    </div>
                    <p className="feedback-message">{feedback.message}</p>
                    <p className="feedback-date">
                      {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-feedback' && (
          <div className="feedback-list-container">
            <h2>My Feedback History</h2>
            {loading ? (
              <p>Loading...</p>
            ) : myFeedback.length === 0 ? (
              <p className="no-items">You haven't submitted any feedback yet</p>
            ) : (
              <div className="feedback-grid">
                {myFeedback.map((feedback) => (
                  <div key={feedback._id} className="feedback-card my-feedback-card">
                    <div className="feedback-header-card">
                      <div className="feedback-user-info">
                        <h3>Your Feedback</h3>
                      </div>
                      {renderStars(feedback.rating)}
                    </div>
                    <p className="feedback-message">{feedback.message}</p>
                    <p className="feedback-date">
                      {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Feedback;