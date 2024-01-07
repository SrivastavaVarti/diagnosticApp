import React, { useState, useEffect } from 'react';
import { Table, Badge } from 'react-bootstrap';
import axios from 'axios';

const formatDate = (dateString) => {
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const BookingDetailsPage = () => {
  const [bookingDetails, setBookingDetails] = useState([]);
  const userId = localStorage.getItem('userId'); // Get user ID from localStorage

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // console.log("frontend "+token);

        const response = await axios.get(`http://localhost:3001/booking-details/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
        console.log(response);
        setBookingDetails(response.data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };
    fetchBookingDetails();
  }, [userId]);

  return (
    <Table striped bordered hover className='bdpTable'>
      <thead>
        <tr>
          <th>Booking ID</th>
          <th>Customer Name</th>
          <th>Phone Number</th>
          <th>Test Name</th>
          <th>Prescription</th>
          <th>Date</th>
          <th>Time</th>
          <th>Address</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {bookingDetails.map(booking => (
          <tr key={booking.id}>
            <td>{booking.id}</td>
            <td>{booking.customerName}</td>
            <td>{booking.phoneNum}</td>
            <td>{booking.testName}</td>
            <td>{booking.prescription}</td>
            <td>{formatDate(booking.date)}</td>
            <td>{booking.time}</td>
            <td>{booking.address}</td>
            <td>
              <Badge variant={booking.isDone ? 'success' : 'warning'}>
                {booking.isDone ? 'Done' : 'Pending'}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default BookingDetailsPage;
