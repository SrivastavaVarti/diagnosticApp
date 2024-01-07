import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewBookingPage = () => {
  const [diagnosticOptions, setDiagnosticOptions] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    testName: '',
    prescription: null,
    date: '',
    time: '',
    phoneNum: '',
    address: '',
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchDiagnosticOptions = async () => {
      try {
        const response = await axios.get('http://localhost:3001/diagnostic-options');
        setDiagnosticOptions(response.data);
      } catch (error) {
        console.error('Error fetching diagnostic options:', error);
      }
    };
    fetchDiagnosticOptions();
  }, []);

  const handleFileChange = (e) => {
    setFormData({ ...formData, prescription: e.target.files[0] });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    console.log("userid nbp "+userId)

    const isLoggedIn = token ? true : false;

     if (!isLoggedIn) {
        navigate('/login');
        return;
     }

    try {
      console.log("from data nbp ")
      console.log(formData)
        const response = await axios.post(
            'http://localhost:3001/bookings',
            {
              ...formData,
              userId
            }
          );
          
      console.log("resp nbp "+response.data);
      setBookingSuccess(true);
      setError('');

      setTimeout(() => {
        navigate('/booking-details');
      }, 1000);

    } catch (error) {
        console.error('Error during booking:', error);
      setError('Error booking the test. Please try again.');
      setBookingSuccess(false);
      }
  };

  const handleAlertClose = () => {
    setBookingSuccess(false);
    setError('');
  };

  return (
    <div>
      <Container>
        <h1 className="mt-4">New Booking</h1>
        {bookingSuccess && (
          <Alert variant="success" onClose={handleAlertClose} dismissible>
            Booking successful! Your appointment has been scheduled.
          </Alert>
        )}
        {error && (
          <Alert variant="danger" onClose={handleAlertClose} dismissible>
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="customerName">
            <Form.Label className='form_label'>Customer Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              name='customerName'
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="testName">
            <Form.Label className='form_label'>Test Type</Form.Label>
            <Form.Control as="select" name="testName" onChange={handleChange} required>
              <option value="">Select...</option>
              {diagnosticOptions.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="prescription">
            <Form.Label className='form_label'>Prescription</Form.Label>
            <Form.Control type="file" accept=".pdf, .doc, .docx" onChange={handleFileChange} />
          </Form.Group>

          <Form.Group controlId="date">
            <Form.Label className='form_label'>Date</Form.Label>
            <Form.Control type="date" name="date" onChange={handleChange} required />
          </Form.Group>

          <Form.Group controlId="time">
            <Form.Label className='form_label'>Time</Form.Label>
            <Form.Control type="time" name="time" onChange={handleChange} required />
          </Form.Group>

          <Form.Group controlId="phoneNum">
            <Form.Label className='form_label'>Phone number</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter your number"
              name='phoneNum'
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="address">
            <Form.Label className='form_label'>Address</Form.Label>
            <Form.Control as="textarea" rows={3} name="address" onChange={handleChange} required />
          </Form.Group>
          <Button variant="primary" type="submit" className='btn'>
            Book Now
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default NewBookingPage;
