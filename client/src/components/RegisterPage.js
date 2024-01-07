import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    custName: '',
    password: '',
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/register', formData);
      console.log(response.data);
      setRegistrationSuccess(true);
      setFormData({
        username: '',
        custName: '',
        password: '',
      });
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('Error registering user:', error.response.data);
      setError(error.response.data);
    }
  };

  const handleAlertClose = () => {
    setRegistrationSuccess(false);
    setError('');
  };

  return (
    <div>
      <Container>
        <h1 className="mt-4">Register</h1>
        {registrationSuccess && (
          <Alert variant="success" onClose={handleAlertClose} dismissible>
            Registration successful! You can now log in.
          </Alert>
        )}
        {error && (
          <Alert variant="danger" onClose={handleAlertClose} dismissible>
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username">
            <Form.Label className='form_label'>Email Id</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="custName">
            <Form.Label className='form_label'>Customer Name</Form.Label>
            <Form.Control
              type="text"
              name="custName"
              value={formData.custName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label className='form_label'>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className='btn'>
            Register
          </Button>
          <p className="mt-3">
          Already have an account?{' '}
          <Link to="/login">
            Login here
          </Link>
        </p>
        </Form>
      </Container>
    </div>
  );
};

export default RegisterPage;
