// src/components/specific/ServiceDetails.js
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Card, Container, ListGroup, Spinner, Alert, Badge, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faCircle, faCalendarAlt, faFile } from '@fortawesome/free-solid-svg-icons';
import { fetchServiceDetails, fetchDocumentPreview } from '../../services/api';
import '../../assets/styles/AppliedServiceDetails.css';

const AppliedServiceDetails = () => { 
    // Retrieve user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const { serviceID } = useParams();
    const location = useLocation();
    const [serviceDetails, setServiceDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (location.state) {
            setServiceDetails(location.state);
            setLoading(false);
        } else {
            const fetchDetails = async () => {
                try {
                    const data = await fetchServiceDetails(serviceID);
                    setServiceDetails(data);
                } catch (error) {
                    setError('Error fetching service details. Please try again later.');
                } finally {
                    setLoading(false);
                }
            };

            fetchDetails();
        }
    }, [location.state, serviceID]);

    const parseDocuments = (documents) => {
        try {
            return documents.map((doc) => JSON.parse(doc));
        } catch (error) {
            console.error('Error parsing documents:', error);
            return [];
        }
    };

    const handlePreviewDocument = async (documentId) => {
        try {
            const { fileURL, fileName } = await fetchDocumentPreview(documentId);

            // Open the file in a new tab
            window.open(fileURL, '_blank');
        } catch (error) {
            console.error('Error previewing document:', error);
            alert('Unable to preview document. Please try again later.');
        }
    };

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    if (!serviceDetails) {
        return null;
    }

    const parsedDocuments = parseDocuments(serviceDetails.submittedDocuments);

    return (
        <Container className="d-flex flex-column min-vh-100 mb-4 mt-2">
            <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white text-center">
                    <FontAwesomeIcon icon={faFileAlt} /> Service Details
                </Card.Header>
                <Card.Body>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <FontAwesomeIcon icon={faCircle} className="me-2" />
                            <strong>Application ID:</strong> {serviceDetails.applicationID}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <FontAwesomeIcon icon={faCircle} className="me-2" />
                            <strong>Procurement Ref. No.:</strong> {serviceDetails.postID}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <FontAwesomeIcon icon={faCircle} className="me-2" />
                            <strong>Status:</strong> <Badge bg={serviceDetails.status === 'approved' ? 'success' : serviceDetails.status === 'rejected' ? 'danger' : 'warning'}>{serviceDetails.status}</Badge>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                            <strong>Last Updated:</strong> {new Date(serviceDetails.updatedAt).toLocaleString()}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <FontAwesomeIcon icon={faFile} className="me-2" />
                            <strong>Submitted Documents:</strong>
                            <ul className="mt-2">
                                {parsedDocuments.map((doc) => (
                                    <li key={doc.$id}>
                                        <Button
                                            variant="link"
                                            className="p-0"
                                            onClick={() => handlePreviewDocument(doc.$id)}
                                            style={{ textDecoration: 'none', color: '#007bff' }}
                                        >
                                            {doc.name}
                                        </Button> ({(doc.sizeOriginal / 1024).toFixed(2)} KB)
                                    </li>
                                ))}
                            </ul>
                        </ListGroup.Item>
                        {serviceDetails.comments && (
                            <ListGroup.Item>
                                <FontAwesomeIcon icon={faCircle} className="me-2" />
                                <strong>Comments:</strong> {serviceDetails.comments}
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Card.Body>
                <Card.Footer>
                    {userInfo.userType.includes('staff') && (
                        //  TODO: NOT ACTIVE YET
                        // Staff updates the status of the application by providing a status update and add comments if required
                        <Button variant='warning'>Update Supplier Application Status</Button> 
                    )}
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default AppliedServiceDetails;
