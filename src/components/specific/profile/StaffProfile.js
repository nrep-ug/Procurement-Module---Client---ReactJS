// src/components/specific/profile/StaffProfile.js
import React from 'react';
import { Card, ListGroup, ListGroupItem, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faIdBadge, faCalendarAlt, faUserTie, faUserShield } from '@fortawesome/free-solid-svg-icons';

const StaffProfile = ({ user }) => {
    return (
        <Container className="d-flex flex-column min-vh-100 mb-4 mt-2">
            <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white text-center">
                    <FontAwesomeIcon icon={faUserTie} /> Staff Profile
                </Card.Header>
                <Card.Body>
                    <Card.Title className="text-center">
                        <FontAwesomeIcon icon={faUser} /> {user.firstName} {user.middleName} <br /> {user.surName}
                    </Card.Title>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem>
                            <FontAwesomeIcon icon={faIdBadge} /> <strong>Staff ID:</strong> <br /> {user.staffID}
                        </ListGroupItem>
                        <ListGroupItem>
                            <FontAwesomeIcon icon={faUserShield} /> <strong>Role:</strong> <br /> {user.role}
                        </ListGroupItem>
                        <ListGroupItem>
                            <FontAwesomeIcon icon={faUser} /> <strong>User Type:</strong> <br /> {user.userType.join(', ')}
                        </ListGroupItem>
                        <ListGroupItem>
                            <FontAwesomeIcon icon={faCalendarAlt} /> <strong>Account Last Modified on:</strong> <br /> {new Date(user.updatedAt).toLocaleString()}
                        </ListGroupItem>
                    </ListGroup>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default StaffProfile;
