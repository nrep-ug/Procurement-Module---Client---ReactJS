// src/components/common/NavigationBar.js
import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignInAlt, faUserPlus, faSignOutAlt, faUser, faFileAlt, faClipboardList } from '@fortawesome/free-solid-svg-icons';

const NavigationBar = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const handleLogout = () => {
        logout();
        navigate('/sign-in');
    };

    return (
        <Navbar bg="dark" variant="dark" sticky='top' expand="lg" className="shadow-sm">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="fw-bold text-uppercase">
                    <FontAwesomeIcon icon={faHome} className="me-2" />
                    NREP On-line Procurement Portal
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/" className="nav-item">
                            <FontAwesomeIcon icon={faHome} className="me-1" /> Home
                        </Nav.Link>
                        {isAuthenticated && userInfo.userType.includes('staff') && (
                            <Nav.Link as={Link} to="/create-procurement-post" className="nav-item">
                                <FontAwesomeIcon icon={faFileAlt} className="me-1" /> Create Post
                            </Nav.Link>
                        )}
                        {isAuthenticated && userInfo.userType.includes('supplier') && (
                            <Nav.Link as={Link} to="/applied/list" className="nav-item">
                                <FontAwesomeIcon icon={faClipboardList} className="me-1" /> Applied
                            </Nav.Link>
                        )}
                        {isAuthenticated ? (
                            <NavDropdown
                                title={<FontAwesomeIcon icon={faUser} />}
                                id="user-dropdown"
                                align="end"
                                className="nav-item"
                            >
                                <NavDropdown.Item as={Link} to="/profile">
                                    Profile
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>
                                    <FontAwesomeIcon icon={faSignOutAlt} className="me-1" /> Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                                <Button as={Link} to="/sign-in" variant="outline-light" className="me-2">
                                    <FontAwesomeIcon icon={faSignInAlt} className="me-1" /> Sign In
                                </Button>
                                <Button as={Link} to="/sign-up" variant="success">
                                    <FontAwesomeIcon icon={faUserPlus} className="me-1" /> Sign Up
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
