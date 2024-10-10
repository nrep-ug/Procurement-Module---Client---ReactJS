import React, { useEffect, useState } from 'react';
import { Container, Card, ButtonGroup, Button, Spinner, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDate2 } from '../../utils/formatDate.js';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.js';
import { fetchDocumentPreview } from '../../services/api';
import { serverURL } from '../../configs/urls.js';
import '../../assets/styles/ProcurementDetails.css';

const ProcurementDetails = () => {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();

    const [userInfo, setUserInfo] = useState([]);
    const [procurement, setProcurement] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Retrieve user info from localStorage when isAuthenticated changes
    useEffect(() => {
        if (isAuthenticated) {
            const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
            setUserInfo(storedUserInfo);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchProcurementDetails = async () => {
            try {
                const response = await axios.get(`${serverURL}/api/procure/get-service/${id}`);
                setProcurement(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching procurement details:', error);
                setLoading(false);
            }
        };

        fetchProcurementDetails();
    }, [id]);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (!procurement) {
        return (
            <Container className="text-center mt-5">
                <h3>Procurement Details Not Found</h3>
                <p>We could not find the procurement details you were looking for.</p>
            </Container>
        );
    }

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

    const parsedDocuments = parseDocuments(procurement.otherDocuments);

    return (
        <Container fluid className="procurement-details-container d-flex flex-column justify-content-center  min-vh-100">
            <Card className="procurement-details-card shadow-sm">
                <Card.Header className="procurement-details-header">
                    <h1 className="text-center">{procurement.title}</h1>
                    <section className="procurement-details-section">
                        <h4></h4>
                        <p ><strong>Category:</strong> {procurement.category}</p>
                        <p><strong>Procurement Ref. No.:</strong> {procurement.procureID}</p>
                        {/* <p><strong>Issuance Date:</strong> {new Date(procurement.issuanceDate).toLocaleDateString()}</p> */}
                        <p>
                            <strong>Submission Deadline:</strong> {formatDate2(procurement.submissionDeadline)}
                        </p>
                        {procurement.deadlineExtension ?
                            <p>
                                <Badge pill bg="warning" text='dark'><strong>Deadline Extended:</strong> {formatDate2(procurement.extendedDeadline)}</Badge>
                            </p>
                            : null
                        }

                        {
                            /* <p><strong>Contract Award Date:</strong> {new Date(procurement.contractAwardDate).toLocaleDateString()}</p>
                            <p><strong>Questions Deadline:</strong> {new Date(procurement.questionsDeadline).toLocaleDateString()}</p> */
                        }
                    </section>
                </Card.Header>
                <Card.Body className="procurement-details-body">
                    <section className="procurement-details-section">
                        <h4>Introduction</h4>
                        <p>{procurement.introduction}</p>
                    </section>

                    <section className="procurement-details-section">
                        <h4>Description</h4>
                        <p>{procurement.description}</p>
                    </section>

                    <section className="procurement-details-section">
                        <h4>Evaluation Criteria</h4>
                        <ul>
                            {procurement.evaluationCriteria.map((criteria, index) => (
                                <li key={index}>{criteria}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="procurement-details-section">
                        <h4>Submission Requirements</h4>
                        <ul>
                            {procurement.submissionRequirements.map((requirement, index) => (
                                <li key={index}>{requirement}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="procurement-details-section">
                        <h4>Terms and Conditions</h4>
                        <ul>
                            {procurement.termsAndConditions.map((term, index) => (
                                <li key={index}>{term}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="procurement-details-section">
                        <h4>Deliverables</h4>
                        <ul>
                            {procurement.deliverables.map((deliverable, index) => (
                                <li key={index}>{deliverable}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="procurement-details-section">
                        <h4>Important Documents</h4>
                        <ul className='mt-2'>

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
                    </section>
                </Card.Body>
                <Card.Footer className="procurement-details-footer text-center">
                    {
                        isAuthenticated ?
                            <>

                                {
                                    userInfo.userType.includes('supplier')
                                        ?
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            onClick={() => navigate(`/apply-procurement/${procurement.procureID}`)}
                                        >
                                            Apply for Procurement
                                        </Button>
                                        :
                                        userInfo.userType.includes('staff')
                                            ?
                                            <Button
                                                variant="warning"
                                                size="lg"
                                                onClick={() => navigate(`/edit-procurement/${procurement.procureID}`)} // TODO: The editting component to be implemented
                                            >
                                                Edit Procurement Post
                                            </Button>
                                            :
                                            null
                                }
                            </>
                             :
                            <>
                                <div>Sign in or create an account before you can appply to provide this service</div>
                                <ButtonGroup>

                                    <Button
                                        variant="outline-success"
                                        size="lg"
                                        onClick={() => navigate(`/sign-in`)}
                                    >
                                        Sign in into your account
                                    </Button>

                                    <Button
                                        variant="outline-info"
                                        size="lg"
                                        onClick={() => navigate(`/sign-up`)}
                                    >
                                        Create an account
                                    </Button>
                                </ButtonGroup>
                            </>
                    }
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default ProcurementDetails;
