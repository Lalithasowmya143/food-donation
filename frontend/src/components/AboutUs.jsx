import React from 'react';

function AboutUs() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>About FoodShare</h1>
          <p>Connecting generous donors with those in need to create a hunger-free community through technology and compassion.</p>
        </div>
      </section>

      <section className="impact-section">
        <h2>Our Mission & Vision</h2>
        <div className="impact-cards">
          <div className="impact-card">
            <div className="impact-icon">
              <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=200&h=200&fit=crop" alt="Our Mission" />
            </div>
            <h3>Our Mission</h3>
            <p>To eliminate food waste and hunger by building a bridge between food donors and organizations serving those in need.</p>
          </div>

          <div className="impact-card highlight">
            <div className="impact-icon">
              <img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=200&h=200&fit=crop" alt="Our Vision" />
            </div>
            <h3>Our Vision</h3>
            <p>A world where no food goes to waste and no one goes to bed hungry, powered by community collaboration.</p>
          </div>

          <div className="impact-card">
            <div className="impact-icon">
              <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=200&fit=crop" alt="Our Values" />
            </div>
            <h3>Our Values</h3>
            <p>Compassion, sustainability, transparency, and community-driven impact in everything we do.</p>
          </div>
        </div>
      </section>

      <section className="impact-section" style={{backgroundColor: '#fff5f5', paddingTop: '80px', paddingBottom: '80px', width: '100%', margin: '0'}}>
        <div style={{maxWidth: '1400px', margin: '0 auto', padding: '0 40px'}}>
          <h2>How FoodShare Works</h2>
          <div className="impact-cards">
            <div className="impact-card">
              <div className="impact-icon">
                <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=200&h=200&fit=crop" alt="Step 1" />
              </div>
              <h3>1. Donors Register</h3>
              <p>Restaurants, grocery stores, and individuals sign up to donate excess food that would otherwise go to waste.</p>
            </div>

            <div className="impact-card">
              <div className="impact-icon">
                <img src="https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=200&h=200&fit=crop" alt="Step 2" />
              </div>
              <h3>2. Post or Request Food</h3>
              <p>Donors post available food donations, while orphanages and shelters submit their food needs.</p>
            </div>

            <div className="impact-card">
              <div className="impact-icon">
                <img src="https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=200&h=200&fit=crop" alt="Step 3" />
              </div>
              <h3>3. Connect & Deliver</h3>
              <p>Organizations accept donations, coordinate pickup, and meals reach those who need them most.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <h2>Our Impact So Far</h2>
        <div className="impact-cards">
          <div className="impact-card">
            <div className="impact-icon" style={{backgroundColor: '#e8f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{fontSize: '48px', fontWeight: 'bold', color: '#e63946'}}>500+</span>
            </div>
            <h3>Meals Delivered</h3>
            <p>Nutritious meals provided to families and children in need across our community.</p>
          </div>

          <div className="impact-card">
            <div className="impact-icon" style={{backgroundColor: '#fff3cd', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{fontSize: '48px', fontWeight: 'bold', color: '#e63946'}}>50+</span>
            </div>
            <h3>Active Donors</h3>
            <p>Generous restaurants, businesses, and individuals committed to reducing food waste.</p>
          </div>

          <div className="impact-card">
            <div className="impact-icon" style={{backgroundColor: '#d4edda', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{fontSize: '48px', fontWeight: 'bold', color: '#e63946'}}>25+</span>
            </div>
            <h3>Partner Organizations</h3>
            <p>Orphanages, shelters, and community centers receiving regular food donations.</p>
          </div>
        </div>
      </section>

      <section className="events-section">
        <h2>Why Choose FoodShare?</h2>
        <div className="events-list">
          <div className="event-card">
            <div className="event-details">
              <h3>Real-Time Coordination</h3>
              <p>Our platform enables instant communication between donors and recipients, ensuring food reaches those in need while still fresh.</p>
            </div>
            <div className="event-info">
              <p><strong>Feature:</strong> Live notifications</p>
              <p><strong>Benefit:</strong> Reduced waste</p>
            </div>
          </div>

          <div className="event-card">
            <div className="event-details">
              <h3>Verified Partners</h3>
              <p>All organizations are verified to ensure donations reach legitimate recipients, giving donors peace of mind.</p>
            </div>
            <div className="event-info">
              <p><strong>Feature:</strong> Partner verification</p>
              <p><strong>Benefit:</strong> Trust & transparency</p>
            </div>
          </div>

          <div className="event-card">
            <div className="event-details">
              <h3>Community Impact</h3>
              <p>Track your donation impact and see how your contributions are making a difference in the community.</p>
            </div>
            <div className="event-info">
              <p><strong>Feature:</strong> Impact dashboard</p>
              <p><strong>Benefit:</strong> Measurable change</p>
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
            <h3>Join Our Mission</h3>
            <p>Together, we can create a hunger-free community where every meal counts and no food goes to waste.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AboutUs;