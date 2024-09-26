// src/components/specific/ProcurementForm.js

import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row, Alert, Card, Container, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faCalendarAlt, faFileAlt, faClipboardList, faEnvelope, faCheckCircle, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import DatePickerModal from '../common/DatePickerModal';
import ArrayInput from '../common/ArrayInput';
import FileUploadComponent from '../common/FileUploadComponent';
import { fetchCategories, submitProcurePost } from '../../services/api.js';
import '../../assets/styles/ProcurementForm.css';

const ProcurementForm = () => {
    const createdBy = 'NREP-001' // USER ID
    const navigate = useNavigate();

    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState([])
    const [showDatePicker, setShowDatePicker] = useState({ show: false, field: '' });
    const [selectedDate, setSelectedDate] = useState({
        issuanceDate: '',
        submissionDeadline: '',
        questionsDeadline: '',
        contractAwardDate: ''
    });
    const [formData, setFormData] = useState({
        title: '',
        introduction: '',
        description: '',
        category: '',
        deliverables: [],
        submissionRequirements: [],
        evaluationCriteria: [],
        termsAndConditions: [],
        // contactInformation: '',
        otherDocuments: null
    });
    const [submissionStatus, setSubmissionStatus] = useState(null);

    useEffect(() => {
        const fetchCat = async () => {
            const data = await fetchCategories();
            if (data.length < 1) {
                return
            }

            setCategories(data);
        }

        fetchCat()

    }, [])

    const handleDateSelect = (date, field) => {
        setSelectedDate({ ...selectedDate, [field]: date.toLocaleDateString() });
        setShowDatePicker({ show: false, field: '' });
    };

    const handleDatePickerOpen = (field) => {
        setShowDatePicker({ show: true, field });
    };

    const handleDatePickerClose = () => {
        setShowDatePicker({ show: false, field: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleArrayChange = (field, items) => {
        setFormData({ ...formData, [field]: items });
    };

    const handleFileUpload = (file) => {
        setFormData({ ...formData, otherDocuments: file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitting(true);


        // Create a new FormData object
        const data = new FormData();

        // Append text fields to FormData
        data.append('category', formData.category)
        data.append('title', formData.title);
        data.append('introduction', formData.introduction);
        data.append('description', formData.description);
        data.append('issuanceDate', selectedDate.issuanceDate);
        data.append('submissionDeadline', selectedDate.submissionDeadline);
        data.append('questionsDeadline', selectedDate.questionsDeadline);
        data.append('contractAwardDate', selectedDate.contractAwardDate);
        data.append('createdBy', createdBy);

        // Append arrays as JSON strings
        data.append('deliverables', JSON.stringify(formData.deliverables));
        data.append('submissionRequirements', JSON.stringify(formData.submissionRequirements));
        data.append('evaluationCriteria', JSON.stringify(formData.evaluationCriteria));
        data.append('termsAndConditions', JSON.stringify(formData.termsAndConditions));

        // Append the file
        if (formData.otherDocuments) {
            data.append('otherDocuments', formData.otherDocuments);
        }

        // // To inspect the content of FormData:
        // for (const pair of data.entries()) {
        //     console.log(`${pair[0]}: ${pair[1]}`);
        // }

        try {
            // Send form data as multipart/form-data in the api
            const response = await submitProcurePost(data)

            console.log('Procurement post response: ', response);

            if (response.status === 201) {
                setSubmissionStatus({ type: 'success', message: 'Procurement post successfully created!' });
                // Reset the form state
                setFormData({
                    title: '',
                    introduction: '',
                    description: '',
                    category: '',
                    deliverables: [],
                    submissionRequirements: [],
                    evaluationCriteria: [],
                    termsAndConditions: [],
                    otherDocuments: null
                });
                setSelectedDate({
                    issuanceDate: '',
                    submissionDeadline: '',
                    questionsDeadline: '',
                    contractAwardDate: ''
                });

                navigate(`/procure-detail/${response.data.data.procureID}`);

            } else {
                console.error('Failed to create procurement post: ', response);
                setSubmissionStatus({ type: 'error', message: 'Failed to create procurement post. Please try again.' });
            }

            setSubmitting(false);

        } catch (error) {
            setSubmissionStatus({ type: 'error', message: 'An error occurred. Please try again.' });
            setSubmitting(false);
        }
    };



    return (
        <Container className="procurement-form-container">
            <Card className="p-4" border='success'>
                <Card.Header>
                    <h3 className="text-center mb-4">Create Procurement Post</h3>
                </Card.Header>
                <Form onSubmit={handleSubmit}>
                    <Card.Body>

                        <Form.Group controlId="category">
                            <Form.Label>Select Category</Form.Label>
                            <Form.Select
                                aria-label="Select Category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option>Select a category</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.catID}
                                        // value={category.catID}
                                        value={category.name}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>


                        <br />

                        <Row>
                            <Col md={12}>
                                <Form.Group controlId="title">
                                    <Form.Label>
                                        <FontAwesomeIcon icon={faFileAlt} /> Procurement Title
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Title: [Service/Product] Procurement for [Specific Purpose/Project]"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="custom-input"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <br />

                        <Form.Group controlId="introduction">
                            <Form.Label>Introduction</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Brief introduction of the company/organization and the purpose of the procurement"
                                value={formData.introduction}
                                onChange={handleChange}
                                className="custom-textarea"
                                required
                            />
                        </Form.Group>

                        <br />

                        <Form.Group controlId="description">
                            <Form.Label>Scope of Work / Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Detailed description of the service/product required. Include specifications, quality standards, and any specific features or functionalities."
                                value={formData.description}
                                onChange={handleChange}
                                className="custom-textarea"
                                required
                            />
                        </Form.Group>

                        <br />

                        <ArrayInput
                            label="Deliverables"
                            placeholder="Enter a deliverable"
                            onChange={(items) => handleArrayChange('deliverables', items)}
                            className="custom-input"
                            required={true}
                        />

                        <br />

                        <ArrayInput
                            label="Submission Requirements"
                            placeholder="Enter a submission requirement"
                            onChange={(items) => handleArrayChange('submissionRequirements', items)}
                            className="custom-input"
                            required={true}
                        />

                        <br />

                        <ArrayInput
                            label="Evaluation Criteria"
                            placeholder="Enter an evaluation criterion"
                            onChange={(items) => handleArrayChange('evaluationCriteria', items)}
                            className="custom-input"
                            required={true}
                        />

                        <br />

                        <ArrayInput
                            label="Terms and Conditions"
                            placeholder="Enter a term or condition"
                            onChange={(items) => handleArrayChange('termsAndConditions', items)}
                            className="custom-input"
                            required={false}
                        />

                        <br />

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="issuanceDate">
                                    <Form.Label>
                                        <FontAwesomeIcon icon={faCalendarAlt} /> RFP Issuance Date
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Select the issuance date"
                                        value={selectedDate.issuanceDate}
                                        readOnly
                                        onClick={() => handleDatePickerOpen('issuanceDate')}
                                        className="custom-input"
                                    />
                                </Form.Group>
                            </Col>

                            <br />

                            <Col md={6}>
                                <Form.Group controlId="submissionDeadline">
                                    <Form.Label>
                                        <FontAwesomeIcon icon={faCalendarAlt} /> Submission Deadline
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Select the submission deadline"
                                        value={selectedDate.submissionDeadline}
                                        readOnly
                                        onClick={() => handleDatePickerOpen('submissionDeadline')}
                                        className="custom-input"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <br />

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="questionsDeadline">
                                    <Form.Label>
                                        <FontAwesomeIcon icon={faCalendarAlt} /> Questions and Clarifications Deadline
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Select the questions deadline"
                                        value={selectedDate.questionsDeadline}
                                        readOnly
                                        onClick={() => handleDatePickerOpen('questionsDeadline')}
                                        className="custom-input"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="contractAwardDate">
                                    <Form.Label>
                                        <FontAwesomeIcon icon={faCalendarAlt} /> Contract Award Date
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Select the contract award date"
                                        value={selectedDate.contractAwardDate}
                                        readOnly
                                        onClick={() => handleDatePickerOpen('contractAwardDate')}
                                        className="custom-input"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <br />

                        {/* File Upload Field */}
                        <Form.Group controlId="otherDocuments" mt={2}>
                            <FileUploadComponent
                                fileType={['pdf', 'doc', 'docx']}
                                maxSize={5}
                                onFileUpload={handleFileUpload}
                                label={'Upload Files (Should be one single file)'}
                                multiple={false}
                                placeholder={"'pdf', 'xls', 'xlsx', 'csv', 'doc', 'docx'"}
                            />
                        </Form.Group>

                        <br />

                        {/* <Form.Group controlId="contactInformation">
                            <Form.Label>
                                <FontAwesomeIcon icon={faEnvelope} /> Contact Information
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Name, email, phone, and address for contact"
                                value={formData.contactInformation}
                                onChange={handleChange}
                                className="custom-textarea"
                            />
                        </Form.Group> */}

                        <div className="text-center">
                            <Button variant="outline-success" type="submit" className="submit-button" disabled={submitting}>
                                <FontAwesomeIcon icon={faCheckCircle} />
                                {
                                    !submitting ?
                                        'Submit Procurement Post'
                                        :
                                        <>
                                            <Spinner animation="grow" variant="secondary" />
                                            <Spinner animation="grow" variant="warning" />
                                            <Spinner animation="grow" variant="danger" />
                                        </>
                                }
                            </Button>
                        </div>

                        {submissionStatus && (
                            <Alert variant={submissionStatus.type === 'success' ? 'success' : 'danger'}>
                                {submissionStatus.message}
                            </Alert>
                        )}
                    </Card.Body>
                </Form>
            </Card>

            <DatePickerModal
                show={showDatePicker.show}
                handleClose={handleDatePickerClose}
                onDateSelect={(date) => handleDateSelect(date, showDatePicker.field)}
            />
        </Container>
    );
};

export default ProcurementForm;
