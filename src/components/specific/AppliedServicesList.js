// src/components/specific/AppliedServicesList.js
import React, { useEffect, useState } from 'react';
import { ListGroup, Container, Card, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getAppliedToServices } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faCircle } from '@fortawesome/free-solid-svg-icons';
import '../../assets/styles/AppliedServicesList.css';

const AppliedServicesList = () => {
    const {id} = useParams()
    const [appliedServices, setAppliedServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch the supplier ID from local storage safely
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const supplierID = id;

    if(userInfo.userType.includes('staff')){}
    else if(userInfo.supplierID===id){}
    else{
        navigate('/')
    }

    useEffect(() => {
        if (supplierID===null || supplierID===undefined) {
            setError('Invalid Supplier ID');
            setLoading(false);
            return;
        }

        const fetchAppliedServices = async () => {
            try {
                const services = await getAppliedToServices(supplierID);
                if (Array.isArray(services)) {
                    setAppliedServices(services);
                } else {
                    setAppliedServices([]); // Fallback to empty array if data is not as expected
                }
            } catch (error) {
                setError('Error fetching applied services. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAppliedServices();
    }, [supplierID]);

    const handleItemClick = (service) => {
        navigate(`/service-details/${service.postID}`, {
            state: {
                applicationID: service.applicationID,
                postID: service.postID,
                submittedDocuments: service.submittedDocuments,
                status: service.status,
                updatedAt: service.updatedAt,
                comments: service.comments,
            },
        });
    };

    if (loading) {
        return (
            <Container className="d-flex flex-column min-vh-100 mb-4 mt-2">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="d-flex flex-column min-vh-100 mb-4 mt-2">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="d-flex flex-column min-vh-100 mb-4 mt-2">
            <Card className="shadow-sm">
                <Card.Header className="bg-info text-white text-center">
                    <FontAwesomeIcon icon={faFileAlt} /> Applications Made
                </Card.Header>
                <ListGroup variant="flush">
                    {appliedServices && appliedServices.length > 0 ? (
                        appliedServices.map((service) => (
                            <ListGroup.Item
                                key={service.applicationID}
                                action
                                onClick={() => handleItemClick(service)}
                                className="d-flex justify-content-between"
                            >
                                <div>
                                    <FontAwesomeIcon icon={faCircle} className="me-2 text-secondary" />
                                    <strong>Application ID:</strong> {service.applicationID}
                                </div>
                                <div>
                                    <strong>Post ID:</strong> {service.postID}
                                </div>
                                <div className={`status-badge status-${service.status.toLowerCase()}`}>
                                    <strong>Status:</strong> {service.status}
                                </div>
                            </ListGroup.Item>
                        ))
                    ) : (
                        <ListGroup.Item className="text-center">
                            Not yet applied to any procurement. All your applications will appear here.
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </Card>
        </Container>
    );
};

export default AppliedServicesList;
