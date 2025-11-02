import React, { useState, useEffect } from 'react';

function DonorDashboard({ token, user }) {
  const [activeTab, setActiveTab] = useState('create-donation');
  const [myDonations, setMyDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [donationForm, setDonationForm] = useState({
    foodType: '',
    quantity: '',
    expiryTime: '',
    pickupAddress: user?.address || '',
    description: ''
  });

  useEffect(() => {
    if (activeTab === 'my-donations') {
      fetchMyDonations();
    } else if (activeTab === 'requests') {
      fetchRequests();
    } else if (activeTab === 'notifications') {
      fetchNotifications();
    }
  }, [activeTab]);

  const fetchMyDonations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/donations/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMyDonations(data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
    setLoading(false);
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
    setLoading(false);
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
    setLoading(false);
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(donationForm)
      });

      if (response.ok) {
        setMessage('Donation created successfully!');
        setDonationForm({
          foodType: '',
          quantity: '',
          expiryTime: '',
          pickupAddress: user?.address || '',
          description: ''
        });
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to create donation');
      }
    } catch (error) {
      setMessage('Server error. Please try again.');
    }
    setLoading(false);
  };

  const handleFulfillRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/requests/${requestId}/fulfill`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchRequests();
        alert('Request fulfilled successfully! The orphanage will be notified.');
      }
    } catch (error) {
      alert('Error fulfilling request');
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
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
        <h1>Donor Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'create-donation' ? 'tab-active' : ''}
          onClick={() => setActiveTab('create-donation')}
        >
          Create Donation
        </button>
        <button 
          className={activeTab === 'my-donations' ? 'tab-active' : ''}
          onClick={() => setActiveTab('my-donations')}
        >
          My Donations
        </button>
        <button 
          className={activeTab === 'requests' ? 'tab-active' : ''}
          onClick={() => setActiveTab('requests')}
        >
          Food Requests
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
        {activeTab === 'create-donation' && (
          <div className="form-container">
            <h2>Create Food Donation</h2>
            {message && <div className="success-message">{message}</div>}
            <form onSubmit={handleDonationSubmit}>
              <div className="form-group">
                <label>Food Type</label>
                <input
                  type="text"
                  value={donationForm.foodType}
                  onChange={(e) => setDonationForm({...donationForm, foodType: e.target.value})}
                  required
                  placeholder="e.g., Rice, Vegetables, Cooked Meals"
                />
              </div>

              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="text"
                  value={donationForm.quantity}
                  onChange={(e) => setDonationForm({...donationForm, quantity: e.target.value})}
                  required
                  placeholder="e.g., 10 kg, 50 meals"
                />
              </div>

              <div className="form-group">
                <label>Best Before/Expiry Time</label>
                <input
                  type="text"
                  value={donationForm.expiryTime}
                  onChange={(e) => setDonationForm({...donationForm, expiryTime: e.target.value})}
                  required
                  placeholder="e.g., 2 hours, Today 6 PM"
                />
              </div>

              <div className="form-group">
                <label>Pickup Address</label>
                <textarea
                  value={donationForm.pickupAddress}
                  onChange={(e) => setDonationForm({...donationForm, pickupAddress: e.target.value})}
                  required
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  value={donationForm.description}
                  onChange={(e) => setDonationForm({...donationForm, description: e.target.value})}
                  rows="3"
                  placeholder="Any additional information"
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Donation'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'my-donations' && (
          <div className="items-container">
            <h2>My Donations</h2>
            {loading ? (
              <p>Loading...</p>
            ) : myDonations.length === 0 ? (
              <p className="no-items">No donations yet</p>
            ) : (
              <div className="items-grid">
                {myDonations.map(donation => (
                  <div key={donation._id} className="item-card">
                    <div className="item-header">
                      <h3>{donation.foodType}</h3>
                      <span className={`status-badge ${donation.status}`}>
                        {donation.status}
                      </span>
                    </div>
                    <p><strong>Quantity:</strong> {donation.quantity}</p>
                    <p><strong>Expiry:</strong> {donation.expiryTime}</p>
                    <p><strong>Pickup:</strong> {donation.pickupAddress}</p>
                    {donation.description && <p><strong>Description:</strong> {donation.description}</p>}
                    
                    {donation.status === 'accepted' && donation.acceptedBy && (
                      <div className="contact-details">
                        <h4>Accepted By:</h4>
                        <p><strong>Name:</strong> {donation.acceptedBy.organizationName || donation.acceptedBy.name}</p>
                        <p><strong>Phone:</strong> {donation.acceptedBy.phone}</p>
                        <p><strong>Address:</strong> {donation.acceptedBy.address}</p>
                        <p><strong>Email:</strong> {donation.acceptedBy.email}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="items-container">
            <h2>Food Requests from Orphanages</h2>
            {loading ? (
              <p>Loading...</p>
            ) : requests.length === 0 ? (
              <p className="no-items">No pending requests</p>
            ) : (
              <div className="items-grid">
                {requests.map(request => (
                  <div key={request._id} className="item-card">
                    <div className="item-header">
                      <h3>{request.foodType}</h3>
                      <span className={`urgency-badge ${request.urgency}`}>
                        {request.urgency} priority
                      </span>
                    </div>
                    <p><strong>Quantity Needed:</strong> {request.quantity}</p>
                    {request.description && <p><strong>Description:</strong> {request.description}</p>}
                    
                    <div className="contact-details">
                      <h4>Requested By:</h4>
                      <p><strong>Name:</strong> {request.orphanageId.organizationName || request.orphanageId.name}</p>
                      <p><strong>Phone:</strong> {request.orphanageId.phone}</p>
                      <p><strong>Address:</strong> {request.orphanageId.address}</p>
                    </div>
                    
                    <button 
                      className="btn-primary"
                      onClick={() => handleFulfillRequest(request._id)}
                    >
                      Fulfill This Request
                    </button>
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

export default DonorDashboard;