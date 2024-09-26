// src/components/specific/profile/SupplierProfile.js
import React from 'react';
import { Card, Container, Tab, Tabs, ListGroup, ListGroupItem } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBuilding,
    faUser,
    faPhone,
    faEnvelope,
    faGlobe,
    faMapMarkerAlt,
    faCalendarAlt,
    faBoxOpen
} from '@fortawesome/free-solid-svg-icons';

const SupplierProfile = ({ user }) => {
    return (
        <Container className="d-flex flex-column min-vh-100 mb-4 mt-2">
            <Card className="shadow-sm">
                <Card.Header className="bg-success text-white text-center">
                    <FontAwesomeIcon icon={faBuilding} /> Supplier Profile
                </Card.Header>
                <Card.Body>
                    <Tabs defaultActiveKey="company" id="supplier-profile-tabs" className="mb-3">
                        <Tab eventKey="company" title="Company Information">
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>
                                    <FontAwesomeIcon icon={faBuilding} /> <strong>Organization Name:</strong>  {user.name}
                                </ListGroupItem>
                                <ListGroupItem>
                                    <FontAwesomeIcon icon={faBoxOpen} /> <strong>Products/Services:</strong>  {user.productsServices.join(', ')}
                                </ListGroupItem>
                                <ListGroupItem>
                                    <FontAwesomeIcon icon={faGlobe} /> <strong>Country:</strong>  {user.country}
                                </ListGroupItem>
                                <ListGroupItem>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} /> <strong>City:</strong>  {user.city}
                                </ListGroupItem>
                                <ListGroupItem>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} /> <strong>Address:</strong>  {user.address}
                                </ListGroupItem>
                                <ListGroupItem>
                                    <FontAwesomeIcon icon={faEnvelope} /> <strong>Email:</strong>  {user.email}
                                </ListGroupItem>
                                <ListGroupItem>
                                    <FontAwesomeIcon icon={faBuilding} /> <strong>About:</strong>  {user.about}
                                </ListGroupItem>
                            </ListGroup>
                        </Tab>
                        <Tab eventKey="contact" title="Contact Person Information">
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>
                                    <FontAwesomeIcon icon={faUser} /> <strong>Name:</strong>  {user.contactPerson}
                                </ListGroupItem>
                                <ListGroupItem>
                                    <FontAwesomeIcon icon={faUser} /> <strong>Role:</strong>  {user.contactPersonRole}
                                </ListGroupItem>
                                <ListGroupItem>
                                    <FontAwesomeIcon icon={faPhone} /> <strong>Phone:</strong>  {user.contactPersonPhone}
                                </ListGroupItem>
                                <ListGroupItem>
                                    <FontAwesomeIcon icon={faEnvelope} /> <strong>Email:</strong>  {user.contactPersonEmail}
                                </ListGroupItem>
                            </ListGroup>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SupplierProfile;