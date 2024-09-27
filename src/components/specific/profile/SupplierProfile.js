// src/components/specific/profile/SupplierProfile.js

import React from 'react';
import {
    Card,
    Container,
    Row,
    Col,
    Tabs,
    Tab,
    Button,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBuilding,
    faUserTie,
    faPhone,
    faEnvelope,
    faGlobe,
    faMapMarkerAlt,
    faBoxOpen,
    faClipboardList,
    faKey,
} from '@fortawesome/free-solid-svg-icons';
import '../../../assets/styles/SupplierProfile.css'; // Import custom CSS

const SupplierProfile = ({ supplier }) => {
    const navigate = useNavigate();

    console.log('Supplier data: ', supplier)

    return (
        <Container className="supplier-profile-container d-flex flex-column justify-content-center min-vh-100">
            <Card className="supplier-profile-card shadow-lg">
                <Card.Header className="text-center supplier-profile-header">
                    <h2>
                        <FontAwesomeIcon icon={faBuilding} /> {supplier.name}
                    </h2>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={4} className="text-center mb-4">
                            {
                                supplier.logo === null ?
                                    <h3>Category:</h3>
                                    :
                                    <>

                                        <img
                                            src={supplier.logo}
                                            alt="Company Logo"
                                            className="company-logo"
                                        />
                                        <h4 className="mt-3">{supplier.name}</h4>
                                    </>
                            }
                            <p className="text-muted">{supplier.category.join(', ') || 'Industry'}</p>
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/applied/list')}
                                className="mt-2"
                            >
                                <FontAwesomeIcon icon={faClipboardList} /> View Applications
                            </Button>
                        </Col>
                        <Col md={8}>
                            <Tabs defaultActiveKey="company" id="supplier-profile-tabs" className="mb-3">
                                <Tab eventKey="company" title="Company Info">
                                    <Row>
                                        <Col md={6}>
                                            <p>
                                                <FontAwesomeIcon icon={faBuilding} />{' '}
                                                <strong>About:</strong><br />
                                                {supplier.about}
                                            </p>
                                            <hr />
                                            <p>
                                                <FontAwesomeIcon icon={faBoxOpen} />{' '}
                                                <strong>Products/Services:</strong><br />
                                                {supplier.productsServices.join(', ')}
                                            </p>
                                            <hr />
                                            <p>
                                                <FontAwesomeIcon icon={faGlobe} />{' '}
                                                <strong>Country:</strong> {supplier.country}
                                            </p>
                                            <hr />
                                            <p>
                                                <FontAwesomeIcon icon={faMapMarkerAlt} />{' '}
                                                <strong>City:</strong> {supplier.city}
                                            </p>
                                            <hr />
                                            <p>
                                                <FontAwesomeIcon icon={faMapMarkerAlt} />{' '}
                                                <strong>Address:</strong> {supplier.address}
                                            </p>
                                            <hr />

                                        </Col>
                                        <Col md={6}>
                                            <p>
                                                <FontAwesomeIcon icon={faEnvelope} />{' '}
                                                <strong>Email:</strong> {supplier.email}
                                            </p>
                                            <hr />
                                            <p>
                                                <FontAwesomeIcon icon={faPhone} />{' '}
                                                <strong>Phone:</strong> {supplier.phone}
                                            </p>
                                            <hr />
                                        </Col>
                                    </Row>
                                </Tab>
                                <Tab eventKey="contact" title="Contact Person">
                                    <Row>
                                        <Col md={6}>
                                            <p>
                                                <FontAwesomeIcon icon={faUserTie} />{' '}
                                                <strong>Name:</strong> {supplier.contactPerson}
                                            </p>
                                            <hr />
                                            <p>
                                                <FontAwesomeIcon icon={faUserTie} />{' '}
                                                <strong>Role:</strong> {supplier.contactPersonRole}
                                            </p>
                                            <hr />
                                        </Col>
                                        <Col md={6}>
                                            <p>
                                                <FontAwesomeIcon icon={faEnvelope} />{' '}
                                                <strong>Email:</strong> {supplier.contactPersonEmail}
                                            </p>
                                            <hr />
                                            <p>
                                                <FontAwesomeIcon icon={faPhone} />{' '}
                                                <strong>Phone:</strong> {supplier.contactPersonPhone}
                                            </p>
                                            <hr />
                                        </Col>
                                    </Row>
                                </Tab>
                                <Tab eventKey="login" title="Account Details">
                                    <Row>
                                        <Col md={12}>
                                            <p>
                                                <FontAwesomeIcon icon={faEnvelope} />{' '}
                                                <strong>Login Email:</strong> {supplier.accountEmail}
                                            </p>
                                            <hr />
                                            <Button
                                                variant="warning"
                                                onClick={() => navigate('/request-password-reset')}
                                            >
                                                <FontAwesomeIcon icon={faKey} /> Change Password
                                            </Button>
                                        </Col>
                                    </Row>
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SupplierProfile;
