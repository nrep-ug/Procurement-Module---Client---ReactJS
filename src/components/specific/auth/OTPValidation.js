// src/components/specific/auth/OTPValidation.js

import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { validateOtpForPasswordReset } from '../../../services/auth'; // Assume this function handles OTP validation

const OTPValidation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get the email from the location state passed from the previous component
    const stateEmail = location.state?.email;

    const [otpCode, setOtpCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [email, setEmail] = useState(stateEmail ?? null);

    // Only access the component if email is passed in the location state, else navigate back to `request-password-reset` route
    useEffect(() => {
        if (email === null) {
            navigate('/request-password-reset');
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await validateOtpForPasswordReset(email, otpCode);
            if (response.success) {
                setSuccessMessage(response.message);
                setTimeout(() => {
                    navigate('/set-new-password', { state: { email, otpCode } });
                }, 2000); // Redirect after 2 seconds
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError('An error occurred while validating OTP. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex flex-column justify-content-center  min-vh-100">
            <h2 className="text-center mb-4">Validate OTP</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="otpCode" className="mb-3">
                    <Form.Label>Enter OTP Code</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter the OTP sent to your email"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
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
                            Validate OTP
                        </Button>
                    )}
                </div>
            </Form>
        </Container>
    );
};

export default OTPValidation;
