// src/components/specific/SupplierRegistration.js

import React, { useState, useEffect } from 'react';
import {
    Form,
    Button,
    Col,
    Row,
    Alert,
    Card,
    Container,
    Spinner,
    InputGroup,
    FormControl,
    ListGroup,
    Modal,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileAlt,
    faClipboardList,
    faEnvelope,
    faPhone,
    faCheckCircle,
    faFileUpload,
    faMapPin,
    faSignIn,
    faEye,
    faEyeSlash,
    faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import ArrayInput from '../common/ArrayInput';
import FileUploadComponent from '../common/FileUploadComponent';
import SelectableModal from '../common/SelectableModal.js';
import EmailSelectionModal from '../common/EmailSelectionModal';
import { fetchCategories, createSupplierAccount } from '../../services/api.js';
import '../../assets/styles/SupplierRegistration.css';

const SupplierRegistration = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);
    const [creatingAccount, setCreatingAccount] = useState(false);
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
        confirmPassword: '',
        accountEmail: '',
    });
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [passwordValidity, setPasswordValidity] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
        passwordsMatch: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const maxCharacters = 1000;

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
            return;
        }
        setFormData({ ...formData, [id]: value });

        if (id === 'password' || id === 'confirmPassword') {
            validatePassword({
                ...formData,
                [id]: value,
            });
        }
    };

    const validatePassword = (data) => {
        const { password, confirmPassword } = data;
        const length = password.length >= 8;
        const uppercase = /[A-Z]/.test(password);
        const lowercase = /[a-z]/.test(password);
        const number = /\d/.test(password);
        const specialChar = /[\W_]/.test(password);
        const passwordsMatch = password === confirmPassword && password !== '';

        setPasswordValidity({
            length,
            uppercase,
            lowercase,
            number,
            specialChar,
            passwordsMatch,
        });
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

    const handleModalClose = () => setShowModal(false);
    const handleModalShow = () => setShowModal(true);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage(null);

        if (formData.email === formData.contactPersonEmail) {
            setErrorMessage('The contact person email should be different from the company email.');
            return;
        }
        if (formData.email && formData.contactPersonEmail) {
            setShowEmailModal(true);
            return;
        }

        // If only one email is provided, set accountEmail
        formData.accountEmail = formData.email || formData.contactPersonEmail;

        await submitForm(formData);
    };

    const submitForm = async (formData) => {
        setCreatingAccount(true);

        if (
            !passwordValidity.length ||
            !passwordValidity.uppercase ||
            !passwordValidity.lowercase ||
            !passwordValidity.number ||
            !passwordValidity.specialChar ||
            !passwordValidity.passwordsMatch
        ) {
            setErrorMessage('Please ensure your password meets all the requirements.');
            setCreatingAccount(false);
            return;
        }

        const data = new FormData();

        // Use 'accountEmail' from formData
        if (formData.accountEmail) {
            data.append('accountEmail', formData.accountEmail);
        } else {
            setErrorMessage('No account email provided.');
            setCreatingAccount(false);
            return;
        }

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

        // Append arrays properly
        formData.category.forEach((item) => data.append('category[]', item));
        formData.productsServices.forEach((item) =>
            data.append('productsServices[]', item)
        );

        if (formData.documents) {
            data.append('documents', formData.documents);
        }

        try {
            const response = await createSupplierAccount(data);

            if (response.status === 201) {
                setSubmissionStatus({
                    type: 'success',
                    message: 'Supplier Account successfully created!',
                });
                setShowSuccessModal(true);
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
                    confirmPassword: '',
                    accountEmail: '',
                });
                setPasswordValidity({
                    length: false,
                    uppercase: false,
                    lowercase: false,
                    number: false,
                    specialChar: false,
                    passwordsMatch: false,
                });
            } else {
                setSubmissionStatus({ type: 'error', message: response.data.message });
            }
            setCreatingAccount(false);
        } catch (error) {
            console.log('Client side error: ', error);
            setCreatingAccount(false);
            setSubmissionStatus({ type: 'error', message: `${error}` });
        }
    };

    const handleEmailSelection = (email) => {
        setShowEmailModal(false);
        submitForm({ ...formData, accountEmail: email });
    };

    return (
        <Container className="supplier-form-container">
            <Card className="p-4" border="success">
                <Card.Header>
                    <h3 className="text-center mb-4">
                        <FontAwesomeIcon icon={faClipboardList} /> Create Supplier Account
                    </h3>
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
                                    <Form.Label>
                                        <FontAwesomeIcon icon={faClipboardList} /> Select Company/Organization
                                        Category (Max 4)
                                    </Form.Label>
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
                            <Form.Label>
                                <FontAwesomeIcon icon={faFileAlt} /> About Company/Organization
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Brief introduction of the company/organization"
                                value={formData.about}
                                onChange={handleChange}
                                className="custom-textarea"
                                required
                            />
                            <small>
                                <b>{formData.about.length}/{maxCharacters} characters</b>
                            </small>
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
                            <Form.Label>
                                <FontAwesomeIcon icon={faMapPin} /> Country
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Country"
                                value={formData.country}
                                onChange={handleChange}
                                className="custom-input"
                                required
                            />
                        </Form.Group>

                        <br />

                        <Form.Group controlId="city">
                            <Form.Label>
                                <FontAwesomeIcon icon={faMapPin} /> City
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                className="custom-input"
                                required
                            />
                        </Form.Group>

                        <br />

                        <Form.Group controlId="contactPerson">
                            <Form.Label>
                                <FontAwesomeIcon icon={faFileAlt} /> Contact Person - Full Name
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Full Name"
                                value={formData.contactPerson}
                                onChange={handleChange}
                                className="custom-input"
                                required
                            />
                        </Form.Group>

                        <br />

                        <Form.Group controlId="contactPersonRole">
                            <Form.Label>
                                <FontAwesomeIcon icon={faFileAlt} /> Contact Person - Role
                            </Form.Label>
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
                                placeholder="Email Address"
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
                                placeholder="Phone Number"
                                value={formData.contactPersonPhone}
                                onChange={handleChange}
                                className="custom-input"
                                required
                            />
                        </Form.Group>

                        <br />

                        {/* Password and Confirm Password Fields */}
                        <Form.Group controlId="password">
                            <Form.Label>
                                <FontAwesomeIcon icon={faSignIn} /> Account Password
                            </Form.Label>
                            <InputGroup>
                                <FormControl
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Provide a strong password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="custom-input"
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

                        <br />

                        <Form.Group controlId="confirmPassword">
                            <Form.Label>
                                <FontAwesomeIcon icon={faSignIn} /> Confirm Password
                            </Form.Label>
                            <InputGroup>
                                <FormControl
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="custom-input"
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
                        <ListGroup className="mb-3 mt-3">
                            <ListGroup.Item>
                                <FontAwesomeIcon
                                    icon={passwordValidity.length ? faCheckCircle : faTimesCircle}
                                    className={passwordValidity.length ? 'text-success' : 'text-danger'}
                                />{' '}
                                At least 8 characters
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <FontAwesomeIcon
                                    icon={passwordValidity.uppercase ? faCheckCircle : faTimesCircle}
                                    className={passwordValidity.uppercase ? 'text-success' : 'text-danger'}
                                />{' '}
                                Contains an uppercase letter
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <FontAwesomeIcon
                                    icon={passwordValidity.lowercase ? faCheckCircle : faTimesCircle}
                                    className={passwordValidity.lowercase ? 'text-success' : 'text-danger'}
                                />{' '}
                                Contains a lowercase letter
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <FontAwesomeIcon
                                    icon={passwordValidity.number ? faCheckCircle : faTimesCircle}
                                    className={passwordValidity.number ? 'text-success' : 'text-danger'}
                                />{' '}
                                Contains a number
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <FontAwesomeIcon
                                    icon={passwordValidity.specialChar ? faCheckCircle : faTimesCircle}
                                    className={passwordValidity.specialChar ? 'text-success' : 'text-danger'}
                                />{' '}
                                Contains a special character
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <FontAwesomeIcon
                                    icon={passwordValidity.passwordsMatch ? faCheckCircle : faTimesCircle}
                                    className={
                                        passwordValidity.passwordsMatch ? 'text-success' : 'text-danger'
                                    }
                                />{' '}
                                Passwords match
                            </ListGroup.Item>
                        </ListGroup>

                        {/* File Upload Field */}
                        <Form.Group controlId="documents" className="mt-3">
                            <Form.Label>
                                <FontAwesomeIcon icon={faFileUpload} /> Optional - Upload Files (e.g., Certificate
                                of Incorporation)
                            </Form.Label>
                            <FileUploadComponent
                                fileType={['pdf', 'doc', 'docx']}
                                maxSize={5}
                                onFileUpload={handleFileUpload}
                                label="Upload a single PDF or DOC file"
                                multiple={false}
                                placeholder="'pdf', 'doc', 'docx'"
                            />
                        </Form.Group>

                        <br />

                        {/* Submit Button and Messages */}
                        <div className="text-center">
                            {creatingAccount ? (
                                <>
                                    <Spinner animation="border" variant="primary" />
                                    <Spinner animation="border" variant="secondary" />
                                    <Spinner animation="border" variant="success" />
                                </>
                            ) : (
                                <Button variant="success" type="submit" className="submit-button">
                                    <FontAwesomeIcon icon={faCheckCircle} /> Create Account
                                </Button>
                            )}
                        </div>

                        {errorMessage && (
                            <Alert variant="danger" className="mt-3">
                                <FontAwesomeIcon icon={faTimesCircle} /> {errorMessage}
                            </Alert>
                        )}

                        {submissionStatus && submissionStatus.type === 'error' && (
                            <Alert variant="danger" className="mt-3">
                                {submissionStatus.message}
                            </Alert>
                        )}
                    </Card.Body>
                </Form>
            </Card>

            {/* Category Selection Modal */}
            <SelectableModal
                show={showModal}
                handleClose={handleModalClose}
                options={categories}
                type="checkbox"
                labelKey="name"
                valueKey="name"
                onSelectionChange={handleCategorySelection}
            />

            {/* Email Selection Modal */}
            <EmailSelectionModal
                show={showEmailModal}
                handleClose={() => setShowEmailModal(false)}
                onSelectEmail={handleEmailSelection}
                emails={[formData.email, formData.contactPersonEmail]}
            />

            {/* Success Modal */}
            <Modal show={showSuccessModal} onHide={() => { }} backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Account Created Successfully!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Your supplier account has been created successfully.</p>
                    <p>You can now sign in using your account email and password.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => navigate('/sign-in')}>
                        Go to Sign In
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default SupplierRegistration;
