import React from 'react';
// import axios from 'axios';
import './components/css.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import NewBookingPage from './components/NewBookingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import BookingDetailsPage from './components/BookingDetailsPage';
import BookingListPage from './components/BookingListPage';
import NavBar from './components/NavBar';
import Footer from './components/footer';

function App() {

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" exact element={<LandingPage />} />
        <Route path="/new-booking" element={<NewBookingPage />}/>
        <Route path="/booking-details" element={<BookingDetailsPage />} />
        <Route path="/booking-list" element={<BookingListPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
