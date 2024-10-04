// src/components/specific/admin/SuppliersList.js

import React, { useEffect, useState } from 'react';
import {
    Container,
    Card,
    Button,
    Pagination,
    Spinner,
    Row,
    Col,
    Alert,
    Table,
    ToggleButtonGroup,
    ToggleButton,
    Badge 
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { formatDate2 } from '../../../utils/formatDate.js';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext.js';
import { serverURL } from '../../../configs/urls.js';
import '../../../assets/styles/SuppliersList.css'; // Custom CSS file for additional styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faIndustry,
    faMapMarkerAlt,
    faList,
    faTh,
} from '@fortawesome/free-solid-svg-icons';

const SuppliersList = () => {
    const navigate = useNavigate();

    const { isAuthenticated } = useAuth();
    let userInfo;
    let userType = [];

    // Retrieve user info from localStorage if authenticated
    if (isAuthenticated) {
        userInfo = JSON.parse(localStorage.getItem('userInfo'));
        userType = userInfo.userType;
    }

    const [suppliers, setSuppliers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDocuments, setTotalDocuments] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    const fetchSuppliers = async (page) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `${serverURL}/api/procure/suppliers/pages`,
                {
                    params: {
                        page,
                    },
                }
            );
            const data = response.data;

            console.log(data.documents)

            setSuppliers(data.documents);
            setTotalDocuments(data.totalDocuments);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching suppliers list: ', error);
            setError('Failed to load suppliers. Please try again later.');
            setLoading(false);
        }
    };

    // Check if user is a staff, else navigate back to `/` route
    useEffect(() => {
        if (!userType.includes('staff')) {
            navigate('/');
        }
    }, [userType, navigate]);

    useEffect(() => {
        fetchSuppliers(currentPage);
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const itemsPerPage = 8; // Make sure this matches your server-side limit
    const totalPages = Math.ceil(totalDocuments / itemsPerPage);

    const getPaginationItems = () => {
        const items = [];

        if (totalPages <= 5) {
            for (let number = 1; number <= totalPages; number++) {
                items.push(
                    <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => handlePageChange(number)}
                    >
                        {number}
                    </Pagination.Item>
                );
            }
        } else {
            items.push(
                <Pagination.Item
                    key={1}
                    active={1 === currentPage}
                    onClick={() => handlePageChange(1)}
                >
                    {1}
                </Pagination.Item>
            );

            if (currentPage > 3) {
                items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
            }

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let number = startPage; number <= endPage; number++) {
                items.push(
                    <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => handlePageChange(number)}
                    >
                        {number}
                    </Pagination.Item>
                );
            }

            if (currentPage < totalPages - 2) {
                items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
            }

            items.push(
                <Pagination.Item
                    key={totalPages}
                    active={totalPages === currentPage}
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </Pagination.Item>
            );
        }

        return items;
    };

    const handleViewModeChange = (val) => {
        setViewMode(val);
    };

    return (
        <Container fluid className="mt-4 suppliers-list-container">
            <div className="suppliers-list-header">
                <h2>Suppliers List</h2>
                <ToggleButtonGroup
                    type="radio"
                    name="viewMode"
                    value={viewMode}
                    onChange={handleViewModeChange}
                    className="toggle-button-group"
                >
                    <ToggleButton id="tbg-radio-1" value={'table'} variant="outline-primary">
                        <FontAwesomeIcon icon={faList} /> Table View
                    </ToggleButton>
                    <ToggleButton id="tbg-radio-2" value={'grid'} variant="outline-primary">
                        <FontAwesomeIcon icon={faTh} /> Grid View
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            {loading ? (
                <div className="loading-spinner d-flex flex-column min-vh-100 mb-4 mt-2">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : error ? (
                <Alert variant="danger" className="text-center">
                    {error}
                </Alert>
            ) : suppliers.length === 0 ? (
                <div className="text-center mt-5">
                    <h3>No supplier records found</h3>
                </div>
            ) : (
                <>
                    {viewMode === 'table' ? (
                        <div className="table-responsive">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Location</th>
                                        <th>Categories</th>
                                        <th>Created On</th>
                                        <th className="actions-column">Number of Applications</th>
                                        <th className="actions-column">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {suppliers.map((supplier) => (
                                        <tr key={supplier.$id}>
                                            <td data-label="Name">{supplier.name}</td>
                                            <td data-label="Location">
                                                {supplier.city}, {supplier.country}
                                            </td>
                                            <td data-label="Categories">{supplier.category.join(', ')}</td>
                                            <td data-label="Created On">{formatDate2(supplier.createdAt)}</td>
                                            <td data-label="Actions" className="actions-column">
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    onClick={() => navigate(`/applied/list/${supplier.supplierID}`)}
                                                    disabled={supplier.applications===0}

                                                >
                                                    <Badge bg="secondary" >{supplier.applications}</Badge> Applications
                                                    {
                                                    supplier.applications> 0 && 
                                                    <>
                                                    <hr/>
                                                    View
                                                    </>
                                                    }
                                                </Button>
                                            </td>
                                            <td data-label="Actions" className="actions-column">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() =>
                                                        navigate(`/supplier-profile/${supplier.$id}`)
                                                    }
                                                >
                                                    View Details
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </Table>
                        </div>
                    ) : (
                        <Row>
                            {suppliers.map((supplier) => (
                                <Col
                                    xl={3}
                                    lg={4}
                                    md={6}
                                    sm={12}
                                    key={supplier.$id}
                                    className="mb-4"
                                >
                                    <Card className="shadow-sm h-100 supplier-card">
                                        <Card.Body>
                                            <Card.Title>{supplier.name}</Card.Title>
                                            <Card.Text>
                                                {supplier.about.substring(0, 100)}...
                                            </Card.Text>
                                            <Card.Text>
                                                <FontAwesomeIcon icon={faMapMarkerAlt} />{' '}
                                                {supplier.city}, {supplier.country}
                                            </Card.Text>
                                            <Card.Text>
                                                <FontAwesomeIcon icon={faIndustry} />{' '}
                                                {supplier.category.join(', ')}
                                            </Card.Text>
                                            <Button
                                                variant="primary"
                                                onClick={() =>
                                                    navigate(`/supplier-profile/${supplier.$id}`)
                                                }
                                            >
                                                View Details
                                            </Button>
                                        </Card.Body>
                                        <Card.Footer className="text-muted">
                                            <small>Supplier ID: {supplier.supplierID}</small>
                                            <br />
                                            <small>Created On: {formatDate2(supplier.createdAt)}</small>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}

                    <Pagination className="justify-content-center mt-4">
                        <Pagination.First
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(1)}
                        />
                        <Pagination.Prev
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        />
                        {getPaginationItems()}
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
    );
};

export default SuppliersList;
