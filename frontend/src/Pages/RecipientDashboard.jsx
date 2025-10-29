import { useState, useEffect } from 'react';

const RecipientDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('available');
  const [donations, setDonations] = useState([]);
  const [myClaimedDonations, setMyClaimedDonations] = useState([]);
  const [stats, setStats] = useState({});

  // Base URL for your deployed API
  const API_BASE_URL = 'https://food-donation-5gz1.onrender.com';

  useEffect(() => {
    fetchDonations();
    fetchMyClaimedDonations();
    fetchStats();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donations`);
      const data = await response.json();
      setDonations(data.filter(d => d.status === 'available'));
    } catch (err) {
      console.error('Error fetching donations:', err);
    }
  };

  const fetchMyClaimedDonations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donations/claimed/${user.id}`);
      const data = await response.json();
      setMyClaimedDonations(data);
    } catch (err) {
      console.error('Error fetching claimed donations:', err);
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

  const handleClaimDonation = async (donationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donations/${donationId}/claim`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          claimedBy: user.id,
          claimedByName: user.name
        })
      });

      if (response.ok) {
        alert('Donation claimed successfully! Please contact the donor to arrange pickup.');
        fetchDonations();
        fetchMyClaimedDonations();
        fetchStats();
      }
    } catch (err) {
      console.error('Error claiming donation:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1>Food Donation System - Recipient</h1>
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
            <h3>{myClaimedDonations.length || 0}</h3>
            <p>My Claimed Donations</p>
          </div>
          <div className="stat-card">
            <h3>{stats.completedDonations || 0}</h3>
            <p>Completed Donations</p>
          </div>
        </div>

        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Available Donations
          </button>
          <button 
            className={`tab ${activeTab === 'my-claims' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-claims')}
          >
            My Claims
          </button>
        </div>

        {activeTab === 'available' && (
          <div className="section">
            <h2>Available Food Donations</h2>
            {donations.length === 0 ? (
              <div className="empty-state">
                <p>No donations available at the moment.</p>
              </div>
            ) : (
              <div className="cards-grid">
                {donations.map((donation) => (
                  <div key={donation._id} className="card">
                    <h3>{donation.foodType}</h3>
                    <div className="card-info">
                      <strong>Donor:</strong> {donation.donorName}
                    </div>
                    <div className="card-info">
                      <strong>Quantity:</strong> {donation.quantity}
                    </div>
                    <div className="card-info">
                      <strong>Expiry:</strong> {new Date(donation.expiryDate).toLocaleDateString()}
                    </div>
                    <div className="card-info">
                      <strong>Pickup Address:</strong> {donation.pickupAddress}
                    </div>
                    <div className="card-info">
                      <strong>Contact:</strong> {donation.contactNumber}
                    </div>
                    {donation.description && (
                      <div className="card-info">
                        <strong>Description:</strong> {donation.description}
                      </div>
                    )}
                    <span className={`status-badge status-${donation.status}`}>
                      {donation.status.toUpperCase()}
                    </span>
                    <div className="card-actions">
                      <button 
                        onClick={() => handleClaimDonation(donation._id)}
                        className="btn-secondary"
                      >
                        Claim Donation
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-claims' && (
          <div className="section">
            <h2>My Claimed Donations</h2>
            {myClaimedDonations.length === 0 ? (
              <div className="empty-state">
                <p>You haven't claimed any donations yet.</p>
              </div>
            ) : (
              <div className="cards-grid">
                {myClaimedDonations.map((donation) => (
                  <div key={donation._id} className="card">
                    <h3>{donation.foodType}</h3>
                    <div className="card-info">
                      <strong>Donor:</strong> {donation.donorName}
                    </div>
                    <div className="card-info">
                      <strong>Quantity:</strong> {donation.quantity}
                    </div>
                    <div className="card-info">
                      <strong>Expiry:</strong> {new Date(donation.expiryDate).toLocaleDateString()}
                    </div>
                    <div className="card-info">
                      <strong>Pickup Address:</strong> {donation.pickupAddress}
                    </div>
                    <div className="card-info">
                      <strong>Contact:</strong> {donation.contactNumber}
                    </div>
                    {donation.description && (
                      <div className="card-info">
                        <strong>Description:</strong> {donation.description}
                      </div>
                    )}
                    <div className="card-info">
                      <strong>Claimed on:</strong> {new Date(donation.createdAt).toLocaleDateString()}
                    </div>
                    <span className={`status-badge status-${donation.status}`}>
                      {donation.status.toUpperCase()}
                    </span>
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

export default RecipientDashboard;