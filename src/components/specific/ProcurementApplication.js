// src/components/specific/ProcurementApplication.js
import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FileUploadComponent from '../common/FileUploadComponent';
import { serverURL } from '../../configs/urls.js';
import '../../assets/styles/ProcurementApplication.css'; // Custom CSS file for additional styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faSpinner, faPaperPlane, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ProcurementApplication = () => {
    // Retrieve user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const supplierID = userInfo.supplierID

    const { id } = useParams(); // Get procurement ID from the URL
    const navigate = useNavigate();

    const [incorporationCertificate, setIncorporationCertificate] = useState(null);
    const [teamCv, setTeamCv] = useState(null);
    const [teamCv2, setTeamCv2] = useState(null);
    const [budget, setBudget] = useState(null);
    const [otherDocument, setOtherDocument] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [service, setService] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null)

        if (!termsAccepted) {
            setError('You must accept the Terms and Conditions to apply.');
            return;
        }

        if (!incorporationCertificate || !teamCv || !budget || !otherDocument) {
            setError('All documents are required.');
            return;
        }

        // Show the confirmation modal
        setShowModal(true);
    };

    const handleConfirmSubmit = async () => {
        // Close the modal
        setShowModal(false);
        setError(null);

        // Create a FormData object to handle file uploads
        const formData = new FormData();
        formData.append('incorporationCertificate', incorporationCertificate);
        formData.append('teamCv', teamCv);
        formData.append('teamCv2', teamCv2);
        formData.append('budget', budget);
        formData.append('otherDocument', otherDocument);
        formData.append('procurementID', id);
        formData.append('supplierID', supplierID);

        try {
            setLoading(true);
            const response = await axios.post(`${serverURL}/api/procure/apply`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                setSuccess('Application submitted successfully!');
                let serviceData = response.data.data;
                setService(serviceData);
                console.log(serviceData);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.status === 409) {
                setError('You already applied for this Procurement.');
            } else {
                console.error('Error submitting application:', error);
                setError('There was an error submitting your application. Please try again later.');
            }
        }
    };

    return (
        <Container fluid className="procurement-application-container d-flex flex-column justify-content-center min-vh-100">
            <Card className="procurement-application-card shadow-lg">
                <Card.Header className="text-center">
                    <h2><FontAwesomeIcon icon={faPaperPlane} /> Apply for Procurement</h2>
                    <p><b>Procurement Ref. No.: </b>{id}</p>
                    {!success && <p className="text-muted">Complete the form below to submit your application.</p>}
                </Card.Header>
                <Card.Body>
                    {success ? (
                        <div className="text-center">
                            <Alert variant="success">
                                <h4><FontAwesomeIcon icon={faCheckCircle} /> {success}</h4>
                                <p>Your application for Procurement Ref. No. {id} has been submitted successfully.</p>
                            </Alert>
                            <Button
                                variant="primary"
                                className="m-2"
                                onClick={() => navigate(`/service-details/${service.postID}`, {
                                    state: {
                                        applicationID: service.applicationID,
                                        postID: service.postID,
                                        submittedDocuments: service.submittedDocuments,
                                        status: service.status,
                                        updatedAt: service.updatedAt,
                                        comments: service.comments,
                                    },
                                })}
                            >
                                <FontAwesomeIcon icon={faArrowRight} /> View Application Status
                            </Button>
                            {/* <Button
                                variant="secondary"
                                className="m-2"
                                onClick={() => navigate('/dashboard')}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} /> Go to Dashboard
                            </Button> */}
                        </div>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                            <FileUploadComponent
                                label="Certificate of Incorporation (PDF)"
                                fileType={['pdf']}
                                maxSize={30}
                                onFileUpload={setIncorporationCertificate}
                            />

                            <hr />

                            <FileUploadComponent
                                label="Budget (DOCX, DOC, PDF, XLSX, XLS, ODS, CSV)"
                                fileType={['docx', 'doc', 'pdf', 'xlsx', 'xls', 'ods', 'csv']}
                                maxSize={10}
                                onFileUpload={setBudget}
                            />

                            <hr />

                            <FileUploadComponent
                                label="Proposal (PDF)"
                                fileType={['pdf']}
                                maxSize={30}
                                onFileUpload={setOtherDocument}
                            />

                            <hr />

                            <FileUploadComponent
                                label="Batch 1 Team CV (Combined PDF - Maximum file size is 30MB)"
                                fileType={['pdf']}
                                maxSize={30}
                                onFileUpload={setTeamCv}
                            />

                            <Form.Label className="mt-4">If combined CV exceeds 30MB, split the PDF and upload second batch below.</Form.Label>

                            <FileUploadComponent
                                label="Batch 2 Team CV (Combined PDF - Maximum file size is 30MB)"
                                fileType={['pdf']}
                                maxSize={30}
                                onFileUpload={setTeamCv2}
                            />

                            <hr />

                            <Form.Group className="mt-4">
                                <Form.Check
                                    type="checkbox"
                                    label="I accept the Terms and Conditions"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className="terms-checkbox"
                                />
                            </Form.Group>

                            <Button
                                variant="outline-success"
                                type="submit"
                                className="mt-4 w-100 submit-button"
                                disabled={loading}
                            >
                                {
                                    !loading ?
                                        <>
                                            <FontAwesomeIcon icon={faPaperPlane} /> Submit Application
                                        </>
                                        :
                                        <>
                                            <Spinner animation="grow" variant="secondary" />
                                            <Spinner animation="grow" variant="success" />
                                            <Spinner animation="grow" variant="danger" />
                                        </>
                                }
                            </Button>
                        </Form>
                    )}
                </Card.Body>

                {error && <Alert variant="danger" className="m-3">
                    <FontAwesomeIcon icon={faExclamationTriangle} /> {error}
                </Alert>}
            </Card>

            {/* Confirmation Modal */}
            <Modal show={showModal} onHide={() => { }} backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Confirm Submission</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Once your application is submitted, no further changes or modifications can be made.</p>
                    <p>Are you sure you want to proceed?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirmSubmit}>
                        Confirm Submission
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ProcurementApplication;
