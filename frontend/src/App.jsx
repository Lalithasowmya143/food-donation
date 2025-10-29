import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '.src/Pages/Login';
import Register from '.src/Pages/Register';
import DonorDashboard from '.src/Pages/DonorDashboard';
import RecipientDashboard from '.src/Pages/RecipientDashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            user ? (
              user.userType === 'donor' ? 
                <Navigate to="/donor-dashboard" /> : 
                <Navigate to="/recipient-dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/login" 
          element={
            user ? (
              user.userType === 'donor' ? 
                <Navigate to="/donor-dashboard" /> : 
                <Navigate to="/recipient-dashboard" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            user ? (
              user.userType === 'donor' ? 
                <Navigate to="/donor-dashboard" /> : 
                <Navigate to="/recipient-dashboard" />
            ) : (
              <Register />
            )
          } 
        />
        <Route 
          path="/donor-dashboard" 
          element={
            user && user.userType === 'donor' ? (
              <DonorDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/recipient-dashboard" 
          element={
            user && user.userType === 'recipient' ? (
              <RecipientDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;