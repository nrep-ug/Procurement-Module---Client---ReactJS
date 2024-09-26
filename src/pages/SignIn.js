// src/pages/SignIn.js
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Image, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const SignIn = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState(''); // New state for userType
    const [error, setError] = useState('');
    const { login } = useAuth(); // Access login function from AuthContext
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(''); // Clear previous error

        const success = await login(email, password, userType); // Pass userType to the login function

        if (success) {
            setLoading(false);
            navigate('/'); // Redirect to the homepage or dashboard upon successful login
        } else {
            setLoading(false);
            setError('Invalid email, password, or user type. Please try again.');
        }
    };

    return (
        <Container fluid className="login-container">
            <Row className="align-items-center justify-content-center min-vh-100">
                <Col>
                    <Card className="login-card shadow-lg">
                        <Card.Body>
                            <div className="d-flex justify-content-center">
                                <Image
                                    src="/images/NREP.webp"
                                    fluid
                                    alt="The National Renewable Energy Platform (NREP)"
                                    style={{ width: '5rem', height: 'auto' }}
                                />
                            </div>
                            <p className="text-center text-muted">National Renewable Energy Platform Procurement Portal</p>
                            <h1 className="text-center mb-4">Sign in</h1>
                            {error && <p className="text-danger text-center">{error}</p>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formEmail" className="mb-3">
                                    <Form.Control
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPassword" className="mb-3">
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formUserType" className="mb-3">
                                    <Form.Select
                                        value={userType}
                                        onChange={(e) => setUserType(e.target.value)}
                                        required
                                    >
                                        <option value="">Select User Type</option>
                                        <option value="supplier">Supplier</option>
                                        <option value="staff">NREP Staff</option>
                                    </Form.Select>
                                </Form.Group>
                                {loading ? (
                                    <>
                                        <Spinner animation="border" variant="primary" />
                                        <Spinner animation="border" variant="secondary" />
                                        <Spinner animation="border" variant="success" />
                                    </>
                                ) : (
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100 mb-3"
                                        disabled={!userType} // Disable button until userType is selected
                                    >
                                        Sign in
                                    </Button>
                                )}
                                <div className="text-center">
                                    <a href="/request-password-reset" className="text-muted">Forgot password?</a>
                                </div>
                            </Form>
                            <p className="text-center mt-4">Don't have an account yet? <a href="/sign-up">Sign Up</a></p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SignIn;
