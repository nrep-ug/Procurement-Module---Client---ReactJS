// src/components/specific/SupplierRegistration.js

import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row, Alert, Card, Container, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faClipboardList, faEnvelope, faPhone, faCheckCircle, faFileUpload, faMapPin, faSignIn } from '@fortawesome/free-solid-svg-icons';
import ArrayInput from '../common/ArrayInput';
import FileUploadComponent from '../common/FileUploadComponent';
import SelectableModal from '../common/SelectableModal.js';
import EmailSelectionModal from '../common/EmailSelectionModal';
import { fetchCategories, createSupplierAccount } from '../../services/api.js';
import '../../assets/styles/SupplierRegistration.css';

const SupplierRegistration = () => {
    const [errorMessage, setErrorMessage] = useState(null)
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState('');
    const [creatingAccount, setCreatingAccount] = useState(false)
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        category: [],
        productsServices: [],
        about: '',
        phone: '',
        email: '',
        address: '',
        country: '',
        city: '',
        contactPerson: '',
        contactPersonPhone: '',
        contactPersonEmail: '',
        contactPersonRole: '',
        documents: null,
        password: '',
    });
    const [submissionStatus, setSubmissionStatus] = useState(null);

    const maxCharacters = 1000; // Maximum character limit for 'About' field

    useEffect(() => {
        const fetchCat = async () => {
            const data = await fetchCategories();
            if (data.length > 0) {
                setCategories(data);
            }
        };

        fetchCat();

    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'about' && value.length > maxCharacters) {
            return; // Prevent further input if the maximum character limit is exceeded
        }
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleCategorySelection = (selection) => {
        setSelectedCategories(selection);
        setFormData({ ...formData, category: selection });
    };

    const handleArrayChange = (field, items) => {
        setFormData({ ...formData, [field]: items });
    };

    const handleFileUpload = (file) => {
        setFormData({ ...formData, documents: file });
    };

    // Selection Modal dialog handling
    const handleModalClose = () => setShowModal(false);
    const handleModalShow = () => setShowModal(true);

    // Submission function
    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage(null);

        // Check if both emails are provided
        if (formData.email === formData.contactPersonEmail) {
            setErrorMessage('The contact person email should be different from the company email');
            return
        }
        if (formData.email && formData.contactPersonEmail) {
            setShowEmailModal(true);
            return; // Stop further submission until the modal selection is made
        }

        // Proceed with submission if only one email exists or both are the same
        await submitForm(formData);
    };

    const submitForm = async (formData) => {


        setCreatingAccount(true)

        const data = new FormData();

        // Add selected email as accountEmail if available
        if (selectedEmail) {
            data.append('accountEmail', selectedEmail);
        }

        // Append text fields to FormData
        data.append('name', formData.name);
        data.append('about', formData.about);
        data.append('phone', formData.phone);
        data.append('email', formData.email);
        data.append('address', formData.address);
        data.append('country', formData.country);
        data.append('city', formData.city);
        data.append('contactPerson', formData.contactPerson);
        data.append('contactPersonPhone', formData.contactPersonPhone);
        data.append('contactPersonEmail', formData.contactPersonEmail);
        data.append('contactPersonRole', formData.contactPersonRole);
        data.append('password', formData.password);

        // Append arrays as JSON strings
        data.append('category', JSON.stringify(formData.category));
        data.append('productsServices', JSON.stringify(formData.productsServices));

        // Append the file
        if (formData.documents) {
            data.append('documents', formData.documents);
        }

        // Debugging: Log FormData contents
        console.log('Logging FormData Contents:');
        for (let pair of data.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }

        try {
            console.log(formData);
            const response = await createSupplierAccount(formData);

            if (response.status === 201) {
                setSubmissionStatus({ type: 'success', message: 'Supplier Account successfully created!' });
                // Reset the form state
                setSelectedCategories([]);
                setFormData({
                    name: '',
                    category: [],
                    productsServices: [],
                    about: '',
                    phone: '',
                    email: '',
                    address: '',
                    country: '',
                    city: '',
                    contactPerson: '',
                    contactPersonPhone: '',
                    contactPersonEmail: '',
                    contactPersonRole: '',
                    documents: null,
                    password: '',
                });
            } else {
                setSubmissionStatus({ type: 'error', message: response.data.message });
            }
            setCreatingAccount(false)
        } catch (error) {
            console.log('Client side error: ', error);
            setCreatingAccount(false)
            setSubmissionStatus({ type: 'error', message: `${error}` });
        }
    };

    const handleEmailSelection = (email) => {
        setSelectedEmail(email);
        setShowEmailModal(false);
        submitForm({ ...formData, accountEmail: email });
    };

    return (
        <Container className="supplier-form-container">
            <Card className="p-4" border='success'>
                <Card.Header>
                    <h3 className="text-center mb-4">Create Supplier Account</h3>
                </Card.Header>
                <Form onSubmit={handleSubmit}>
                    <Card.Body>

                        <Row>
                            <Col md={12}>
                                <Form.Group controlId="name">
                                    <Form.Label>
                                        <FontAwesomeIcon icon={faFileAlt} /> Company/Organization Name
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Provide name here..."
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="custom-input"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <br />

                        <Row>
                            <Col md={12}>
                                <Form.Group controlId="category">
                                    <Form.Label>Select Company/Organization Category (Max 4)</Form.Label>
                                    <Button variant="outline-primary" onClick={handleModalShow}>
                                        Select Categories
                                    </Button>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        readOnly
                                        value={selectedCategories.join(', ')}
                                        className="mt-2"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <br />

                        <ArrayInput
                            label="Products/Services provided by the company/organization"
                            placeholder="Enter a product/service"
                            onChange={(items) => handleArrayChange('productsServices', items)}
                            className="custom-input"
                            required={true}
                        />

                        <br />

                        <Form.Group controlId="about">
                            <Form.Label>About Company/Organization</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Brief introduction of the company/organization"
                                value={formData.about}
                                onChange={handleChange}
                                className="custom-textarea"
                                required
                            />

                            <b>{formData.about.length}/1000 characters</b>
                        </Form.Group>

                        <br />

                        <Form.Group controlId="email">
                            <Form.Label>
                                <FontAwesomeIcon icon={faEnvelope} /> Company/Organization Email
                            </Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="custom-input"
                                required
                            />
                        </Form.Group>

                        <br />

                        <Form.Group controlId="phone">
                            <Form.Label>
                                <FontAwesomeIcon icon={faPhone} /> Company/Organization Contact Phone Number
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                className="custom-input"
                                required
                            />
                        </Form.Group>

                        <br />

                        <Form.Group controlId="address">
                            <Form.Label>
                                <FontAwesomeIcon icon={faMapPin} /> Company/Organization Physical Address
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Physical Address"
                                value={formData.address}
                                onChange={handleChange}
                                className="custom-input"
                                required
                            />
                        </Form.Group>

                        <br />

                        <Form.Group controlId="country">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder=""
                                value={formData.country}
                                onChange={handleChange}
                                className="custom-input"
                                required
                            />
                        </Form.Group>

                        <br />

                        <Form.Group controlId="city">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder=""
                                value={formData.city}
                                onChange={handleChange}
                                className="custom-input"
                                required
                            />
                        </Form.Group>

                        <br />

                        <Form.Group controlId="contactPerson">
                            <Form.Label>Contact Person - Fullname</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder=""
                                value={formData.contactPerson}
                                onChange={handleChange}
                                className="custom-input"
                                required
                            />
                        </Form.Group>

                        <br />

                        <Form.Group controlId="contactPersonRole">
                            <Form.Label>Contact Person - Role</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="HR Manager, Procurement Officer, CEO, etc."
                                value={formData.contactPersonRole}
                                onChange={handleChange}
                                className="custom-input"
                                required
                            />
                        </Form.Group>

                        <br />

                        <Form.Group controlId="contactPersonEmail">
                            <Form.Label>
                                <FontAwesomeIcon icon={faEnvelope} /> Contact Person - Email Address
                            </Form.Label>
                            <Form.Control
                                type="email"
                                placeholder=""
                                value={formData.contactPersonEmail}
                                onChange={handleChange}
                                className="custom-input"
                                required
                            />
                        </Form.Group>

                        <br />

                        <Form.Group controlId="contactPersonPhone">
                            <Form.Label>
                                <FontAwesomeIcon icon={faPhone} /> Contact Person - Phone Number
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder=""
                                value={formData.contactPersonPhone}
                                onChange={handleChange}
                                className="custom-input"
                                required
                            />
                        </Form.Group>

                        <br />

                        <Form.Group controlId="password">
                            <Form.Label>
                                <FontAwesomeIcon icon={faSignIn} />
                                Account Password
                            </Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Provide a Strong Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="custom-input"
                                required
                            />
                        </Form.Group>

                        <br />

                        {/* File Upload Field */}
                        <Form.Group controlId="documents" mt={2}>
                            <FontAwesomeIcon icon={faFileUpload} />
                            <FileUploadComponent
                                fileType={['pdf', 'doc', 'docx']}
                                maxSize={5}
                                onFileUpload={handleFileUpload}
                                label={'OPTIONAL - Upload Files e.g Certificate of incorporation (Should be one single file PDF File)'}
                                multiple={false}
                                placeholder={"'pdf'"}
                            />
                        </Form.Group>

                        <br />

                        <div className="text-center">
                            {creatingAccount ? <>
                                <Spinner animation="border" variant="primary" />
                                <Spinner animation="border" variant="secondary" />
                                <Spinner animation="border" variant="success" />
                            </> :
                                <Button variant="success" type="submit" className="submit-button">
                                    <FontAwesomeIcon icon={faCheckCircle} /> Create Account
                                </Button>}
                        </div>

                        {
                            errorMessage !== null
                            &&
                            <Alert variant='danger'>
                                {errorMessage}
                            </Alert>
                        }

                        {submissionStatus && (
                            <Alert variant={submissionStatus.type === 'success' ? 'success' : 'danger'}>
                                {submissionStatus.message}
                            </Alert>
                        )}

                    </Card.Body>
                </Form>
            </Card>

            {/* Use the SelectableModal Component */}
            <SelectableModal
                show={showModal}
                handleClose={handleModalClose}
                options={categories}
                type="checkbox"
                labelKey="name"
                valueKey="name"
                onSelectionChange={handleCategorySelection}
            />

            {/* Select Email To Use For Account Login */}
            <EmailSelectionModal
                show={showEmailModal}
                handleClose={() => setShowEmailModal(false)}
                onSelectEmail={handleEmailSelection}
                emails={[formData.email, formData.contactPersonEmail]}
            />

        </Container>
    );
};

export default SupplierRegistration;
