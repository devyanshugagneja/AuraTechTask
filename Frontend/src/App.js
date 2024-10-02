import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Components/Login'; // Adjust paths as necessary
import Register from './Components/Register';
import Landing from './Components/LandingPage'; // Your landing page component
import './App.css'; // Your global styles

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Redirect from root to login page */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        
        {/* Only allow access to landing page if logged in */}
        <Route path="/landing" element={isLoggedIn ? <Landing /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
