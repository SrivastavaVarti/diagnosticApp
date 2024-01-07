import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import {Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/login', formData);
      // console.log("res lp: ");
      console.log(response);
      setLoginSuccess(true);
      setError('');
      const { token, userId, isAdmin } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('isAdmin', isAdmin);

      console.log("fe token lp "+token)
      // console.log("fe isAdmin lp "+isAdmin)
      // console.log("fe userid lp "+userId)

      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Error during login:', error);
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleAlertClose = () => {
    setLoginSuccess(false);
    setError('');
  };

  return (
    <div>
      <Container>
        <h1 className="mt-4">Login</h1>
        {loginSuccess && (
          <Alert variant="success" onClose={handleAlertClose} dismissible>
            Login successful! You are now logged in.
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
            Login
          </Button>
          <p className="mt-3">
          Don't have an account?{' '}
          <Link to="/register">
            Register here
          </Link>
        </p>
        </Form>
        <p className='cred'>For User login <b>username: </b>user2@gmail.com <b>password: </b>user1234
        <br />
        For Admin login <b>username: </b>admin@gmail.com <b>password: </b>admin123</p>
      </Container>
    </div>
  );
};

export default LoginPage;
