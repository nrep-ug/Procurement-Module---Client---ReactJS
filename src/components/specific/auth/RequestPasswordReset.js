// src/components/specific/auth/RequestPasswordReset.js

import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../../../services/auth'; // Assuming the function is defined in this file

const RequestPasswordReset = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await requestPasswordReset(email);
            if (response.success) {
                setSuccessMessage(response.message);
                setTimeout(() => {
                    navigate('/validate-otp', { state: { email } });
                }, 2000); // Redirect after 2 seconds
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError('An error occurred while requesting password reset. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex flex-column justify-content-center  min-vh-100">
            <Card className='max-w-75 max-w-sm-100 mx-auto bg-light p-12'>
                <Card.Header>
                    <h2 className="text-center mb-4">Step 1: Request Password Reset</h2>

                </Card.Header>
                <Card.Body>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Account Login Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Provide your login email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        {error && <Alert variant="danger">{error}</Alert>}
                        {successMessage && <Alert variant="success">{successMessage}</Alert>}

                        <div className="text-center">
                            {loading ? (
                                <Spinner animation="border" variant="primary" />
                            ) : (
                                <Button variant="primary" type="submit">
                                    Request Password Reset
                                </Button>
                            )}
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RequestPasswordReset;
