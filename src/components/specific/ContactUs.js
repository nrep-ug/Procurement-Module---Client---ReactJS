// src/components/ContactUs.js
import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col, Spinner, Card } from 'react-bootstrap';
import { contactUs } from '../../services/api.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faEnvelope,
    faTag,
    faCommentDots,
    faPhone,
    faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import '../../assets/styles/ContactUs.css';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        from: 'procurement',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required.';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid.';
        }
        if (!formData.subject.trim()) newErrors.subject = 'Subject is required.';
        if (!formData.message.trim()) newErrors.message = 'Message is required.';
        return newErrors;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setErrorMsg('');
        const formErrors = validate();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        setErrors({});
        setSubmitting(true);

        try {
            const response = await contactUs(formData);
            setSuccess('Your message has been sent successfully!');
            setFormData({ name: '', email: '', subject: '', message: '' });
            if (response.success) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setErrorMsg('Failed to send your message. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container className="contact-us-container my-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white text-center">
                            <h3>Contact Us</h3>
                        </Card.Header>
                        <Card.Body>
                            {success && <Alert variant="success">{success}</Alert>}
                            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
                            <Form onSubmit={handleSubmit} noValidate>
                                <Form.Group controlId="formName" className="mt-3">
                                    <Form.Label>
                                        <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
                                        Name
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        isInvalid={!!errors.name}
                                        autoFocus
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="formEmail" className="mt-3">
                                    <Form.Label>
                                        <FontAwesomeIcon icon={faEnvelope} className="me-2 text-primary" />
                                        Email
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email address"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        isInvalid={!!errors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="formSubject" className="mt-3">
                                    <Form.Label>
                                        <FontAwesomeIcon icon={faTag} className="me-2 text-primary" />
                                        Subject
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter the subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        isInvalid={!!errors.subject}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.subject}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="formMessage" className="mt-3">
                                    <Form.Label>
                                        <FontAwesomeIcon icon={faCommentDots} className="me-2 text-primary" />
                                        Message
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        placeholder="Enter your message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        isInvalid={!!errors.message}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
                                </Form.Group>

                                <div className="text-center">
                                    <Button variant="primary" type="submit" className="mt-4 px-5" disabled={submitting}>
                                        {submitting ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Sending...
                                            </>
                                        ) : (
                                            'Send Message'
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                        <Card.Footer className="bg-light">
                            <Row>
                                <Col md={6} className="mb-3 mb-md-0">
                                    <h5>
                                        <FontAwesomeIcon icon={faPhone} className="me-2 text-primary" />
                                        Contact
                                    </h5>
                                    <p className="mb-1">+256 (0) 393100495</p>
                                    <p className="mb-1">info@nrep.ug</p>
                                    <p>nrep.memd@gmail.com</p>
                                </Col>
                                <Col md={6}>
                                    <h5>
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-primary" />
                                        Address
                                    </h5>
                                    <p>
                                        P.O.BOX 163345, Kampala, Uganda
                                        <br />
                                        Ministry of Energy Mineral Development
                                        <br />
                                        Amber House, Plot 29/33, Kampala Road
                                        <br />
                                        Kampala, Uganda
                                    </p>
                                </Col>
                            </Row>
                            <Row>

                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.758688421935!2d32.579368473492536!3d0.31325716403373305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbc809a584a71%3A0x3c18addfcb62e229!2sMinistry%20of%20Energy%20and%20Mineral%20Development!5e0!3m2!1sen!2sug!4v1729587028384!5m2!1sen!2sug"
                                    width="100%"
                                    height="200"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Office Location"
                                ></iframe>
                            </Row>
                        </Card.Footer>
                    </Card>

                </Col>
            </Row>
        </Container>
    );
};

export default ContactUs;
