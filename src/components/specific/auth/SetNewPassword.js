// src/components/specific/auth/SetNewPassword.js

import React, { useState, useEffect } from 'react';
import {
    Container,
    Form,
    Button,
    Alert,
    Spinner,
    InputGroup,
    FormControl,
    ListGroup,
} from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { setNewPassword as resetPassword } from '../../../services/auth'; // Renamed here
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEye,
    faEyeSlash,
    faCheckCircle,
    faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

const SetNewPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get the email and code from the location state passed from the previous component
    const stateEmail = location.state?.email;
    const stateCode = location.state?.otpCode;

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [email, setEmail] = useState(stateEmail ?? null);
    const [code, setCode] = useState(stateCode ?? null);
    const [passwordValidity, setPasswordValidity] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
        passwordsMatch: false,
    });

    // Only access the component if email and otp-code is passed in the location state, else navigate back to `request-password-reset` route
    useEffect(() => {
        if (email === null || code === null) {
            navigate('/request-password-reset');
        }
    }, [email, code, navigate]);

    const validatePassword = (password) => {
        const length = password.length >= 8;
        const uppercase = /[A-Z]/.test(password);
        const lowercase = /[a-z]/.test(password);
        const number = /\d/.test(password);
        const specialChar = /[\W_]/.test(password); // Matches any non-word character

        setPasswordValidity((prevState) => ({
            ...prevState,
            length,
            uppercase,
            lowercase,
            number,
            specialChar,
        }));

        return length && uppercase && lowercase && number && specialChar;
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setNewPassword(password);
        validatePassword(password);
        setPasswordValidity((prevState) => ({
            ...prevState,
            passwordsMatch: password === confirmPassword,
        }));
    };

    const handleConfirmPasswordChange = (e) => {
        const confirmPwd = e.target.value;
        setConfirmPassword(confirmPwd);
        setPasswordValidity((prevState) => ({
            ...prevState,
            passwordsMatch: newPassword === confirmPwd,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Validate password
        if (!validatePassword(newPassword)) {
            setError('Please ensure your password meets all the requirements.');
            return;
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            // Use the aliased function here
            const response = await resetPassword(email, code, newPassword);

            if (response.success) {
                setSuccessMessage(response.message);
                setTimeout(() => {
                    navigate('/sign-in');
                }, 2000); // Redirect after 2 seconds
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError(
                'An error occurred while setting new password. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex flex-column justify-content-center min-vh-100">
            <h2 className="text-center mb-4">Set New Password</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="newPassword" className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <InputGroup>
                        <FormControl
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                        <Button
                            variant="outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </Button>
                    </InputGroup>
                    <Form.Text className="text-muted">
                        Your password must be at least 8 characters long and contain
                        uppercase, lowercase letters, a number, and a special character.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="confirmPassword" className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <InputGroup>
                        <FormControl
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                        />
                        <Button
                            variant="outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </Button>
                    </InputGroup>
                </Form.Group>

                {/* Password Requirements */}
                <ListGroup className="mb-3">
                    <ListGroup.Item>
                        <FontAwesomeIcon
                            icon={passwordValidity.length ? faCheckCircle : faTimesCircle}
                            className={
                                passwordValidity.length ? 'text-success' : 'text-danger'
                            }
                        />{' '}
                        At least 8 characters
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <FontAwesomeIcon
                            icon={passwordValidity.uppercase ? faCheckCircle : faTimesCircle}
                            className={
                                passwordValidity.uppercase ? 'text-success' : 'text-danger'
                            }
                        />{' '}
                        Contains an uppercase letter
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <FontAwesomeIcon
                            icon={passwordValidity.lowercase ? faCheckCircle : faTimesCircle}
                            className={
                                passwordValidity.lowercase ? 'text-success' : 'text-danger'
                            }
                        />{' '}
                        Contains a lowercase letter
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <FontAwesomeIcon
                            icon={passwordValidity.number ? faCheckCircle : faTimesCircle}
                            className={
                                passwordValidity.number ? 'text-success' : 'text-danger'
                            }
                        />{' '}
                        Contains a number
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <FontAwesomeIcon
                            icon={
                                passwordValidity.specialChar ? faCheckCircle : faTimesCircle
                            }
                            className={
                                passwordValidity.specialChar ? 'text-success' : 'text-danger'
                            }
                        />{' '}
                        Contains a special character
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <FontAwesomeIcon
                            icon={
                                passwordValidity.passwordsMatch ? faCheckCircle : faTimesCircle
                            }
                            className={
                                passwordValidity.passwordsMatch
                                    ? 'text-success'
                                    : 'text-danger'
                            }
                        />{' '}
                        Passwords match
                    </ListGroup.Item>
                </ListGroup>

                {error && <Alert variant="danger">{error}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                <div className="text-center">
                    {loading ? (
                        <Spinner animation="border" variant="primary" />
                    ) : (
                        <Button variant="primary" type="submit">
                            Set New Password
                        </Button>
                    )}
                </div>
            </Form>
        </Container>
    );
};

export default SetNewPassword;
