import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // console.log("fe isAdmin nav " + isAdmin);

  const navigate = useNavigate();

  useEffect(() => {
    console.log('Checking login status...');
    checkLoggedIn();
    checkIsAdmin();
  });

  const checkLoggedIn = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      console.log('User is logged in.');
    } else {
      setIsLoggedIn(false);
      console.log('User is not logged in.');
    }
  };

  const checkIsAdmin = () => {
    const adminStatus = localStorage.getItem('isAdmin');
    console.log("isadm ls nav "+ localStorage.getItem('isAdmin'));
    console.log("admS nav "+ adminStatus);
    if (adminStatus) {
      setIsAdmin(adminStatus === '1');
    }
    console.log("admS nav2 "+ adminStatus);
    console.log("isAdm hook nav "+ isAdmin);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);

    navigate('/login');
  };
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className='navbar'>
      <Container>
        <Navbar.Brand as={Link} to="/" style={{marginRight: '10vw'}}>
          Diagnostic App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link as={Link} to="/" className="navelem"> 
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/new-booking" className="navelem"> 
              New Booking
            </Nav.Link>
            {isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/booking-details" className="navelem"> 
                  Booking Details
                </Nav.Link>
                {isAdmin && (
                  <Nav.Link as={Link} to="/booking-list" className="navelem"> 
                    Booking List
                  </Nav.Link>
                )}
                <Nav.Link onClick={handleLogout} className="navelem"> 
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="mr-3"> 
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
