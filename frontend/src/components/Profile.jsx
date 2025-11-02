import React, { useState } from 'react';

function Profile({ token, user, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    organizationName: user?.organizationName || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        onUpdateUser(updatedUser);
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update profile');
      }
    } catch (error) {
      setMessage('Server error. Please try again.');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      organizationName: user?.organizationName || ''
    });
    setIsEditing(false);
    setMessage('');
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>My Profile</h2>
        
        {message && <div className="success-message">{message}</div>}

        {!isEditing ? (
          <div className="profile-view">
            <div className="profile-field">
              <label>User Type</label>
              <p>{user?.userType === 'donor' ? 'Donor' : 'Orphanage'}</p>
            </div>

            <div className="profile-field">
              <label>Name</label>
              <p>{user?.name}</p>
            </div>

            {user?.userType === 'orphanage' && user?.organizationName && (
              <div className="profile-field">
                <label>Organization Name</label>
                <p>{user?.organizationName}</p>
              </div>
            )}

            <div className="profile-field">
              <label>Email</label>
              <p>{user?.email}</p>
            </div>

            <div className="profile-field">
              <label>Phone</label>
              <p>{user?.phone}</p>
            </div>

            <div className="profile-field">
              <label>Address</label>
              <p>{user?.address}</p>
            </div>

            <button className="btn-primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-edit">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {user?.userType === 'orphanage' && (
              <div className="form-group">
                <label>Organization Name</label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
              ></textarea>
            </div>

            <div className="button-group">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;