import React from 'react';

function Navbar({ onNavigate, user, onLogout, currentPage }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => onNavigate('home')}>
          FoodShare
        </div>
        <ul className="nav-menu">
          <li className={currentPage === 'home' ? 'active' : ''}>
            <a onClick={() => onNavigate('home')}>Home</a>
          </li>
          <li className={currentPage === 'about' ? 'active' : ''}>
            <a onClick={() => onNavigate('about')}>About Us</a>
          </li>
          {user && (
            <>
              <li className={currentPage === (user.userType === 'donor' ? 'donor-dashboard' : 'orphanage-dashboard') ? 'active' : ''}>
                <a onClick={() => onNavigate(user.userType === 'donor' ? 'donor-dashboard' : 'orphanage-dashboard')}>
                  Dashboard
                </a>
              </li>
              <li className={currentPage === 'profile' ? 'active' : ''}>
                <a onClick={() => onNavigate('profile')}>Profile</a>
              </li>
              <li className={currentPage === 'feedback' ? 'active' : ''}>
                <a onClick={() => onNavigate('feedback')}>Feedback</a>
              </li>
              <li>
                <a onClick={onLogout}>Logout</a>
              </li>
            </>
          )}
          {!user && (
            <>
              <li className={currentPage === 'login' ? 'active' : ''}>
                <a onClick={() => onNavigate('login')}>Login</a>
              </li>
              <li className={currentPage === 'register' ? 'active' : ''}>
                <a onClick={() => onNavigate('register')}>Register</a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;