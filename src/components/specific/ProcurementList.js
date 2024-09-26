// src\components\specific\ProcurementList.js
import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Pagination, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { formatDate2 } from '../../utils/formatDate.js'
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.js';
import { serverURL } from '../../configs/urls.js';
import '../../assets/styles/ProcurementList.css'; // Custom CSS file for additional styling

const ProcurementList = () => {
    const { isAuthenticated } = useAuth();
    let userInfo;
    let userType = []

    // Retrieve user info from localStorage if is authenticated
    if (isAuthenticated) {
        userInfo = JSON.parse(localStorage.getItem('userInfo'));
        userType = userInfo.userType;
    }

    const [procurements, setProcurements] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDocuments, setTotalDocuments] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchProcurements = async (page) => {
        setLoading(true);
        try {
            const response = await axios.get(`${serverURL}/api/procure/serivces/pages`, {
                params: {
                    page,
                },
            });
            const data = response.data;

            setProcurements(data.documents);
            setTotalDocuments(data.totalDocuments);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching procurement posts:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProcurements(currentPage);
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(totalDocuments / 4);

    return (
        <Container fluid className="d-flex flex-column justify-content-center align-items-center min-vh-100">
            <div className="mt-3 w-100">
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center min-vh-100">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : procurements.length === 0 ? (
                    <div className="text-center mt-5">
                        <h3>No procurement records found</h3>
                        {
                            userType.includes('staff') ?
                                <>
                                    <Button
                                        variant='outline-success'
                                        onClick={() => { navigate('/create-procurement-post') }}
                                    >
                                        Create a Procurent Post
                                    </Button>
                                </>
                                :
                                <p>
                                    There are no procurement posts available at the moment. Please check back later.
                                </p>
                        }
                    </div>
                ) : (
                    <>
                        {procurements.map((procurement) => (
                            <Card key={procurement.$id} className="mb-4 mt-2 shadow-sm">
                                <Card.Body>
                                    <Card.Title>{procurement.title}</Card.Title>
                                    <Card.Text>
                                        {procurement.introduction.substring(0, 100)}...
                                    </Card.Text>
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => navigate(`/procure-detail/${procurement.$id}`)}
                                    >
                                        View Details
                                    </Button>
                                </Card.Body>
                                <Card.Footer className="text-muted">
                                    <small>Procure ID: {procurement.procureID}</small>
                                    <br />
                                    <small>Submission Deadline: {formatDate2(procurement.submissionDeadline)}</small>
                                </Card.Footer>
                            </Card>
                        ))}

                        <Pagination className="justify-content-center mt-4">
                            <Pagination.Prev
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                Previous
                            </Pagination.Prev>

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
                            >
                                Next
                            </Pagination.Next>
                        </Pagination>
                    </>
                )}
            </div>
        </Container>
    );
};

export default ProcurementList;
