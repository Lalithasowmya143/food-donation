import React from 'react';

function Home({ onNavigate }) {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to FoodShare</h1>
          <p>Join us in our mission to reduce food waste and help those in need. Every donation makes a difference.</p>
          <button className="btn-primary" onClick={() => onNavigate('register')}>
            Donate Food
          </button>
        </div>
      </section>

      <section className="impact-section">
        <h2>Impact of Your Donations</h2>
        <div className="impact-cards">
          <div className="impact-card">
            <div className="impact-icon">
              <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=200&h=200&fit=crop" alt="Community Events" />
            </div>
            <h3>Community Events</h3>
            <p>Our community-funded events have helped create a more connected neighborhood.</p>
          </div>

          <div className="impact-card highlight">
            <div className="impact-icon">
              <img src="https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=200&h=200&fit=crop" alt="Meals Provided" />
            </div>
            <h3>Meals Provided</h3>
            <p>Thanks to your donations, we have provided thousands of meals to families in need.</p>
          </div>

          <div className="impact-card">
            <div className="impact-icon">
              <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=200&fit=crop" alt="Volunteer Stories" />
            </div>
            <h3>Volunteer Stories</h3>
            <p>Hear from our volunteers about their experiences making a difference.</p>
          </div>
        </div>
      </section>

      <section className="events-section">
        <h2>Upcoming Events</h2>
        <div className="events-list">
          <div className="event-card">
            <div className="event-details">
              <h3>Holiday Food Drive</h3>
              <p>Join us for our annual holiday food drive to support local families.</p>
            </div>
            <div className="event-info">
              <p><strong>Date:</strong> December 15, 2024</p>
              <p><strong>Location:</strong> Downtown Community Center</p>
            </div>
          </div>

          <div className="event-card">
            <div className="event-details">
              <h3>Soup Kitchen Volunteering</h3>
              <p>Help us prepare and serve food at our local soup kitchen. Every hand helps.</p>
            </div>
            <div className="event-info">
              <p><strong>Date:</strong> January 10, 2025</p>
              <p><strong>Location:</strong> Downtown Rescue Theater</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Contact Information</h3>
            <p><strong>Email:</strong> info@foodshare.org</p>
            <p><strong>Phone:</strong> (123) 456-7890</p>
            <p><strong>Address:</strong> 123 Main Street, Cityville</p>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <p>Stay connected with our mission</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;