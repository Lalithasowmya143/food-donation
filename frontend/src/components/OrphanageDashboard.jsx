import React, { useState, useEffect } from 'react';

function OrphanageDashboard({ token, user }) {
  const [activeTab, setActiveTab] = useState('donations');
  const [donations, setDonations] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // ✅ Use deployed backend URL
  const API_BASE_URL = 'https://food-donation-5gz1.onrender.com';

  const [requestForm, setRequestForm] = useState({
    foodType: '',
    quantity: '',
    urgency: 'medium',
    description: ''
  });

  useEffect(() => {
    if (activeTab === 'donations') {
      fetchDonations();
    } else if (activeTab === 'my-requests') {
      fetchMyRequests();
    } else if (activeTab === 'notifications') {
      fetchNotifications();
    }
  }, [activeTab, token]); // Added token as dependency

  const fetchDonations = async () => {
    setLoading(true);
    try {
      // ✅ Updated to use the deployed API URL
      const response = await fetch(`${API_BASE_URL}/api/donations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setDonations(data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
    setLoading(false);
  };

  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      // ✅ Updated to use the deployed API URL
      const response = await fetch(`${API_BASE_URL}/api/requests/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMyRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
    setLoading(false);
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // ✅ Updated to use the deployed API URL
      const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
    setLoading(false);
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // ✅ Updated to use the deployed API URL
      const response = await fetch(`${API_BASE_URL}/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestForm)
      });

      if (response.ok) {
        setMessage('Request created successfully!');
        setRequestForm({
          foodType: '',
          quantity: '',
          urgency: 'medium',
          description: ''
        });
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to create request');
      }
    } catch (error) {
      setMessage('Server error. Please try again.');
    }
    setLoading(false);
  };

  const handleAcceptDonation = async (donationId) => {
    try {
      // ✅ Updated to use the deployed API URL
      const response = await fetch(`${API_BASE_URL}/api/donations/${donationId}/accept`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchDonations();
        alert('Donation accepted successfully! The donor will be notified with your contact details.');
      }
    } catch (error) {
      alert('Error accepting donation');
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // ✅ Updated to use the deployed API URL
      await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Orphanage Dashboard</h1>
        <p>Welcome back, {user?.organizationName || user?.name}!</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'donations' ? 'tab-active' : ''}
          onClick={() => setActiveTab('donations')}
        >
          Available Donations
        </button>
        <button 
          className={activeTab === 'create-request' ? 'tab-active' : ''}
          onClick={() => setActiveTab('create-request')}
        >
          Create Request
        </button>
        <button 
          className={activeTab === 'my-requests' ? 'tab-active' : ''}
          onClick={() => setActiveTab('my-requests')}
        >
          My Requests
        </button>
        <button 
          className={activeTab === 'notifications' ? 'tab-active' : ''}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications {notifications.filter(n => !n.isRead).length > 0 && (
            <span className="badge">{notifications.filter(n => !n.isRead).length}</span>
          )}
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'donations' && (
          <div className="items-container">
            <h2>Available Food Donations</h2>
            {loading ? (
              <p>Loading...</p>
            ) : donations.length === 0 ? (
              <p className="no-items">No donations available at the moment</p>
            ) : (
              <div className="items-grid">
                {donations.map(donation => (
                  <div key={donation._id} className="item-card">
                    <div className="item-header">
                      <h3>{donation.foodType}</h3>
                      <span className="status-badge available">Available</span>
                    </div>
                    <p><strong>Quantity:</strong> {donation.quantity}</p>
                    <p><strong>Best Before:</strong> {donation.expiryTime}</p>
                    <p><strong>Pickup Address:</strong> {donation.pickupAddress}</p>
                    {donation.description && <p><strong>Description:</strong> {donation.description}</p>}
                    
                    <div className="contact-details">
                      <h4>Donor Information:</h4>
                      <p><strong>Name:</strong> {donation.donorId.name}</p>
                      <p><strong>Phone:</strong> {donation.donorId.phone}</p>
                    </div>
                    
                    <button 
                      className="btn-primary"
                      onClick={() => handleAcceptDonation(donation._id)}
                    >
                      Accept This Donation
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create-request' && (
          <div className="form-container">
            <h2>Create Food Request</h2>
            {message && <div className="success-message">{message}</div>}
            <form onSubmit={handleRequestSubmit}>
              <div className="form-group">
                <label>Food Type Needed</label>
                <input
                  type="text"
                  value={requestForm.foodType}
                  onChange={(e) => setRequestForm({...requestForm, foodType: e.target.value})}
                  required
                  placeholder="e.g., Rice, Vegetables, Cooked Meals"
                />
              </div>

              <div className="form-group">
                <label>Quantity Needed</label>
                <input
                  type="text"
                  value={requestForm.quantity}
                  onChange={(e) => setRequestForm({...requestForm, quantity: e.target.value})}
                  required
                  placeholder="e.g., 10 kg, 50 meals"
                />
              </div>

              <div className="form-group">
                <label>Urgency Level</label>
                <select
                  value={requestForm.urgency}
                  onChange={(e) => setRequestForm({...requestForm, urgency: e.g.target.value})}
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  value={requestForm.description}
                  onChange={(e) => setRequestForm({...requestForm, description: e.target.value})}
                  rows="3"
                  placeholder="Any additional information about your needs"
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Request'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'my-requests' && (
          <div className="items-container">
            <h2>My Food Requests</h2>
            {loading ? (
              <p>Loading...</p>
            ) : myRequests.length === 0 ? (
              <p className="no-items">No requests yet</p>
            ) : (
              <div className="items-grid">
                {myRequests.map(request => (
                  <div key={request._id} className="item-card">
                    <div className="item-header">
                      <h3>{request.foodType}</h3>
                      <span className={`status-badge ${request.status}`}>
                        {request.status}
                      </span>
                    </div>
                    <p><strong>Quantity:</strong> {request.quantity}</p>
                    <p><strong>Urgency:</strong> <span className={`urgency-badge ${request.urgency}`}>{request.urgency}</span></p>
                    {request.description && <p><strong>Description:</strong> {request.description}</p>}
                    <p><strong>Created:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
                    
                    {request.status === 'fulfilled' && request.fulfilledBy && (
                      <div className="contact-details">
                        <h4>Fulfilled By:</h4>
                        <p><strong>Name:</strong> {request.fulfilledBy.name}</p>
                        <p><strong>Phone:</strong> {request.fulfilledBy.phone}</p>
                        <p><strong>Address:</strong> {request.fulfilledBy.address}</p>
                        <p><strong>Email:</strong> {request.fulfilledBy.email}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="notifications-container">
            <h2>Notifications</h2>
            {loading ? (
              <p>Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="no-items">No notifications</p>
            ) : (
              <div className="notifications-list">
                {notifications.map(notification => (
                  <div 
                    key={notification._id} 
                    className={`notification-card ${notification.isRead ? 'read' : 'unread'}`}
                  >
                    <div className="notification-content">
                      <p className="notification-message">{notification.message}</p>
                      
                      {notification.contactDetails && (
                        <div className="contact-details">
                          <h4>Contact Details:</h4>
                          <p><strong>Name:</strong> {notification.contactDetails.name}</p>
                          <p><strong>Phone:</strong> {notification.contactDetails.phone}</p>
                          <p><strong>Address:</strong> {notification.contactDetails.address}</p>
                          <p><strong>Email:</strong> {notification.contactDetails.email}</p>
                        </div>
                      )}
                      
                      <p className="notification-time">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    
                    {!notification.isRead && (
                      <button 
                        className="btn-secondary"
                        onClick={() => markAsRead(notification._id)}
                      >
                        Mark as Read
                      </button>
                    )}
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

export default OrphanageDashboard;