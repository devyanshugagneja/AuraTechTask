import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import LandingPage from './Components/LandingPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <LandingPage /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={isLoggedIn ? <LandingPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
