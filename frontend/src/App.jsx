import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Login from './components/Login';
import Register from './components/Register';
import DonorDashboard from './components/DonorDashboard';
import OrphanageDashboard from './components/OrphanageDashboard';
import Profile from './components/Profile';
import Feedback from './components/Feedback';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    setCurrentPage(userData.userType === 'donor' ? 'donor-dashboard' : 'orphanage-dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    setCurrentPage('home');
  };

  const renderPage = () => {
    if (!user && currentPage !== 'home' && currentPage !== 'about' && currentPage !== 'login' && currentPage !== 'register') {
      return <Home onNavigate={setCurrentPage} />;
    }

    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'about':
        return <AboutUs />;
      case 'login':
        return <Login onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'register':
        return <Register onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'donor-dashboard':
        return user && user.userType === 'donor' ? <DonorDashboard token={token} user={user} /> : <Home onNavigate={setCurrentPage} />;
      case 'orphanage-dashboard':
        return user && user.userType === 'orphanage' ? <OrphanageDashboard token={token} user={user} /> : <Home onNavigate={setCurrentPage} />;
      case 'profile':
        return user ? <Profile token={token} user={user} onUpdateUser={setUser} /> : <Home onNavigate={setCurrentPage} />;
      case 'feedback':
        return user ? <Feedback token={token} user={user} /> : <Home onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      <Navbar 
        onNavigate={setCurrentPage} 
        user={user} 
        onLogout={handleLogout}
        currentPage={currentPage}
      />
      {renderPage()}
    </div>
  );
}

export default App;