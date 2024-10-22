// src/components/common/NavigationBar.js
import React, { useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faSignInAlt,
  faUserPlus,
  faSignOutAlt,
  faUser,
  faUsers,
  faPlusCircle,
  faClipboardList,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import '../../assets/styles/NavigationBar.css';

const NavigationBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    logout();
    navigate('/sign-in');
  };

  return (
    <Navbar
      bg={theme === 'light' ? 'white' : 'dark'}
      variant={theme === 'light' ? 'light' : 'dark'}
      expand="lg"
      sticky="top"
      className="shadow-sm py-2"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
          {/* Replace with your logo */}
          <img src="/images/NREP.webp" alt="Logo" className="navbar-logo me-2" />
          NREP Procurement Portal
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav">
          <FontAwesomeIcon icon={faBars} />
        </Navbar.Toggle>
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link
              as={NavLink}
              to="/"
              end
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              Home
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/contact-us"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              Contact Us
            </Nav.Link>

            {isAuthenticated && userInfo.userType.includes('staff') && (
              <NavDropdown
                title={
                  <>
                    <FontAwesomeIcon icon={faUsers} className="me-1" />
                    Manage
                  </>
                }
                id="staff-dropdown"
                className="nav-item"
              >
                <NavDropdown.Item
                  as={NavLink}
                  to="/suppliers-list"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <FontAwesomeIcon icon={faUsers} className="me-2" />
                  Suppliers
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={NavLink}
                  to="/create-procurement-post"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
                  Create Post
                </NavDropdown.Item>
              </NavDropdown>
            )}

            {isAuthenticated && userInfo.userType.includes('supplier') && (
              <Nav.Link
                as={NavLink}
                to={`/applied/list/${userInfo.supplierID}`}
                className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              >
                <FontAwesomeIcon icon={faClipboardList} className="me-1" />
                My Applications
              </Nav.Link>
            )}

            {isAuthenticated ? (
              <NavDropdown
                title={
                  <>
                    <FontAwesomeIcon icon={faUser} className="me-1" />
                    {userInfo.contactPerson || userInfo.name || 'Account'}
                  </>
                }
                id="user-dropdown"
                align="end"
                className="nav-item"
              >
                <NavDropdown.Item
                  as={NavLink}
                  to="/profile"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/sign-in"
                  className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="me-1" />
                  Sign In
                </Nav.Link>
                <Button as={Link} to="/sign-up" variant="primary" className="ms-2">
                  <FontAwesomeIcon icon={faUserPlus} className="me-1" />
                  Sign Up
                </Button>
              </>
            )}

            {/* Theme Toggle Switch */}
            <Nav.Item className="ms-3">
              <div className="theme-switch-wrapper">
                <label className="theme-switch" htmlFor="theme-toggle">
                  <input
                    type="checkbox"
                    id="theme-toggle"
                    onChange={toggleTheme}
                    checked={theme === 'dark'}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
