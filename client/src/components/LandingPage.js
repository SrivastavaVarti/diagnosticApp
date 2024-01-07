import React, { useState, useEffect } from "react";
import { Carousel, Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from "axios";

const LandingPage = () => {
  const [diagnosticOptions, setDiagnosticOptions] = useState([]);

  useEffect(() => {
    const fetchDiagnosticOptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/diagnostic-options"
        );
        console.log(response);
        setDiagnosticOptions(response.data);
      } catch (error) {
        console.error("Error fetching diagnostic options:", error);
      }
    };

    fetchDiagnosticOptions();
  }, []);

  return (
    <div>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://images.unsplash.com/photo-1583911860205-72f8ac8ddcbe?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://plus.unsplash.com/premium_photo-1661306425676-d4b47c619916?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlhZ25vc3RpYyUyMHRlc3R8ZW58MHwwfDB8fHww"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://images.unsplash.com/photo-1579154392128-bf8c7ebee541?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="First slide"
          />
        </Carousel.Item>
      </Carousel>
      <h2 style={{padding: '10px', margin: '10px'}}>Diagnostic Booking Options</h2>
      <div className="row" style={{margin:'2rem'}}>
        {diagnosticOptions.map((option) => (
          <div key={option.id} className="col-md-4 mb-4">
            <Card style={{ width: '20rem' }}>
              <Card.Body>
                <Card.Title>{option.name}</Card.Title>
                <Card.Text>{option.description}</Card.Text>
                <LinkContainer to="/new-booking">
                  <Button variant="primary">Book Now</Button>
                </LinkContainer>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
