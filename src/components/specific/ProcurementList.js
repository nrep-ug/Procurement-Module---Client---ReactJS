// src/components/specific/ProcurementList.js

import React, { useEffect, useState, useMemo } from 'react';
import {
    Container,
    Card,
    Button,
    Pagination,
    Spinner,
    Badge,
    Alert,
    Row,
    Col,
    Form,
    DropdownButton,
    Dropdown,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faSearch, faFilter, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { formatDate2 } from '../../utils/formatDate.js';
import { allProcurementOpportunities } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.js';
import '../../assets/styles/ProcurementList.css'; // Custom CSS file for additional styling

const ProcurementList = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [procurements, setProcurements] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDocuments, setTotalDocuments] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const statuses = ['active', 'pending', 'closed']; // Available statuses

    const isStaff = useMemo(() => {
        if (isAuthenticated) {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            return userInfo && userInfo.userType.includes('staff');
        }
        return false;
    }, [isAuthenticated]);

    const itemsPerPage = 8; // Should match server-side limit

    const fetchProcurements = async (page, statuses) => {
        setLoading(true);
        setError(null);
        try {
            const data = await allProcurementOpportunities(page, statuses);

            setProcurements(data.documents);
            setTotalDocuments(data.totalDocuments);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching procurement posts:', error);
            setError('Failed to load procurement posts. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        // Determine statuses to fetch based on user type
        if (isStaff) {
            // For staff, fetch with selected statuses or all if none selected
            const statusesToFetch = selectedStatuses.length > 0 ? selectedStatuses : null;
            fetchProcurements(currentPage, statusesToFetch);
        } else {
            // For non-staff, fetch only 'active' procurements
            fetchProcurements(currentPage, ['active']);
        }
    }, [currentPage, selectedStatuses, isStaff]);

    const totalPages = Math.ceil(totalDocuments / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleStatusChange = (status) => {
        let updatedStatuses = [...selectedStatuses];
        if (updatedStatuses.includes(status)) {
            updatedStatuses = updatedStatuses.filter((s) => s !== status);
        } else {
            updatedStatuses.push(status);
        }
        setSelectedStatuses(updatedStatuses);
        setCurrentPage(1); // Reset to first page when filters change
    };

    return (
        // <>
            <Container fluid className="d-flex flex-column justify-content-center min-vh-100 procurement-list-container">
                <div className="d-flex flex-column align-items-center mb-4">
                    <h2 className="text-center display-5 mb-3">Procurement Opportunities</h2>
                    {isStaff && (
                        <div className="d-flex align-items-center">
                            <Button
                                variant="primary"
                                className="me-3 custom-button"
                                onClick={() => navigate('/create-procurement-post')}
                            >
                                <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
                                Create Procurement Post
                            </Button>
                            <DropdownButton
                                id="status-filter-dropdown"
                                title={
                                    <>
                                        <FontAwesomeIcon icon={faFilter} className="me-2" />
                                        Filter by Status
                                    </>
                                }
                                variant="outline-secondary"
                                className="custom-dropdown"
                            >
                                {statuses.map((status) => (
                                    <Dropdown.Item key={status} as="div" className="dropdown-item-custom">
                                        <Form.Check
                                            type="checkbox"
                                            label={status.charAt(0).toUpperCase() + status.slice(1)}
                                            checked={selectedStatuses.includes(status)}
                                            onChange={() => handleStatusChange(status)}
                                        />
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </div>
                    )}
                </div>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center min-vh-50">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : error ? (
                    <Alert variant="danger" className="text-center">
                        {error}
                    </Alert>
                ) : procurements.length === 0 ? (
                    <div className="d-flex flex-column justify-content-center align-items-center mt-5">
                        <FontAwesomeIcon icon={faSearch} size="4x" className="mb-4 text-muted" />
                        <h3 className="no-procurement-title">No Procurement Opportunities Available</h3>
                        {isStaff ? (
                            <div className="mt-3 text-center">
                                <p className="text-muted">
                                    You haven't created any procurement posts yet.
                                </p>
                                <Button
                                    variant="primary"
                                    className="custom-button"
                                    onClick={() => navigate('/create-procurement-post')}
                                >
                                    <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
                                    Create a Procurement Post
                                </Button>
                            </div>
                        ) : (
                            <p className="mt-3 text-muted">
                                Currently, there are no procurement opportunities available. Please check back later.
                            </p>
                        )}
                    </div>
                ) : (
                    <>
                        <Row className="g-4">
                            {procurements.map((procurement) => (
                                <Col md={6} lg={4} key={procurement.$id}>
                                    <Card className="h-100 procurement-card shadow-sm">
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title className="mb-3">{procurement.title}</Card.Title>
                                            <Card.Text className="text-secondary mb-4">
                                                {procurement.introduction.substring(0, 120)}...
                                            </Card.Text>
                                            <div className="mt-auto">
                                                <Button
                                                    variant="outline-primary"
                                                    className="custom-button"
                                                    onClick={() =>
                                                        navigate(`/procure-detail/${procurement.$id}`)
                                                    }
                                                >
                                                    View Details
                                                </Button>
                                            </div>
                                        </Card.Body>
                                        <Card.Footer className="text-muted">
                                            <small>
                                                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                                                Submission Deadline:{' '}
                                                {formatDate2(procurement.submissionDeadline)}
                                            </small>
                                            {procurement.deadlineExtension && (
                                                <div className="mt-2">
                                                    <Badge pill bg="warning" text="dark">
                                                        Deadline Extended:{' '}
                                                        {formatDate2(procurement.extendedDeadline)}
                                                    </Badge>
                                                </div>
                                            )}
                                            {isStaff && (
                                                <div className="mt-2">
                                                    <Badge
                                                        pill
                                                        bg={
                                                            procurement.status === 'active'
                                                                ? 'success'
                                                                : procurement.status === 'pending'
                                                                    ? 'warning'
                                                                    : 'secondary'
                                                        }
                                                        className="status-badge"
                                                    >
                                                        {procurement.status.charAt(0).toUpperCase() +
                                                            procurement.status.slice(1)}
                                                    </Badge>
                                                </div>
                                            )}
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <Pagination className="justify-content-center mt-4">
                            <Pagination.First
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(1)}
                            />
                            <Pagination.Prev
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            />
                            {[...Array(totalPages)].map((_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === currentPage}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            />
                            <Pagination.Last
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(totalPages)}
                            />
                        </Pagination>
                    </>
                )}
            </Container>

        // </>
    );
};

export default ProcurementList;
