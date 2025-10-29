import { useState, useEffect } from 'react';

const DonorDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('create-donation');
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({});
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    expiryDate: '',
    pickupAddress: user.address,
    contactNumber: user.phone,
    description: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Change your backend base URL here
  const API_BASE_URL = 'https://food-donation-5gz1.onrender.com';

  useEffect(() => {
    fetchDonations();
    fetchStats();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donations/donor/${user.id}`);
      const data = await response.json();
      setDonations(data);
    } catch (err) {
      console.error('Error fetching donations:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats`);
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

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
      const response = await fetch(`${API_BASE_URL}/api/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          donorId: user.id,
          donorName: user.name
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Donation created successfully!');
        setFormData({
          foodType: '',
          quantity: '',
          expiryDate: '',
          pickupAddress: user.address,
          contactNumber: user.phone,
          description: ''
        });
        fetchDonations();
        fetchStats();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Failed to create donation');
      }
    } catch (err) {
      setMessage('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteDonation = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donations/${id}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchDonations();
        fetchStats();
      }
    } catch (err) {
      console.error('Error completing donation:', err);
    }
  };

  const handleDeleteDonation = async (id) => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/donations/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchDonations();
          fetchStats();
        }
      } catch (err) {
        console.error('Error deleting donation:', err);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1>Food Donation System - Donor</h1>
        <div className="navbar-right">
          <span className="user-info">Welcome, {user.name}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.totalDonations || 0}</h3>
            <p>Total Donations</p>
          </div>
          <div className="stat-card">
            <h3>{stats.availableDonations || 0}</h3>
            <p>Available Donations</p>
          </div>
          <div className="stat-card">
            <h3>{stats.claimedDonations || 0}</h3>
            <p>Claimed Donations</p>
          </div>
          <div className="stat-card">
            <h3>{stats.completedDonations || 0}</h3>
            <p>Completed Donations</p>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'create-donation' ? 'active' : ''}`}
            onClick={() => setActiveTab('create-donation')}
          >
            Create Donation
          </button>
          <button
            className={`tab ${activeTab === 'my-donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-donations')}
          >
            My Donations
          </button>
        </div>

        {activeTab === 'create-donation' && (
          <div className="section">
            <h2>Create New Donation</h2>
            {message && (
              <div className={message.includes('success') ? 'success-message' : 'error-message'}>
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Food Type</label>
                  <input
                    type="text"
                    name="foodType"
                    value={formData.foodType}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Rice, Vegetables, Cooked Meals"
                  />
                </div>

                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 10 kg, 50 servings"
                  />
                </div>

                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label>Contact Number</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Pickup Address</label>
                <textarea
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Additional details about the food donation"
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Donation'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'my-donations' && (
          <div className="section">
            <h2>My Donations</h2>
            {donations.length === 0 ? (
              <div className="empty-state">
                <p>You haven't created any donations yet.</p>
              </div>
            ) : (
              <div className="cards-grid">
                {donations.map((donation) => (
                  <div key={donation._id} className="card">
                    <h3>{donation.foodType}</h3>
                    <div className="card-info">
                      <strong>Quantity:</strong> {donation.quantity}
                    </div>
                    <div className="card-info">
                      <strong>Expiry:</strong> {new Date(donation.expiryDate).toLocaleDateString()}
                    </div>
                    <div className="card-info">
                      <strong>Pickup:</strong> {donation.pickupAddress}
                    </div>
                    <div className="card-info">
                      <strong>Contact:</strong> {donation.contactNumber}
                    </div>
                    {donation.description && (
                      <div className="card-info">
                        <strong>Description:</strong> {donation.description}
                      </div>
                    )}
                    {donation.claimedByName && (
                      <div className="card-info">
                        <strong>Claimed by:</strong> {donation.claimedByName}
                      </div>
                    )}
                    <span className={`status-badge status-${donation.status}`}>
                      {donation.status.toUpperCase()}
                    </span>
                    <div className="card-actions">
                      {donation.status === 'claimed' && (
                        <button
                          onClick={() => handleCompleteDonation(donation._id)}
                          className="btn-success"
                        >
                          Mark as Completed
                        </button>
                      )}
                      {donation.status === 'available' && (
                        <button
                          onClick={() => handleDeleteDonation(donation._id)}
                          className="btn-danger"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;
