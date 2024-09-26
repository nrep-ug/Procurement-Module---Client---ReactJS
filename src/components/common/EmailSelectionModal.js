// src/components/common/EmailSelectionModal.js

import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EmailSelectionModal = ({ show, handleClose, onSelectEmail, emails }) => {
    const [selectedEmail, setSelectedEmail] = React.useState(emails[0]);

    const handleEmailChange = (e) => {
        setSelectedEmail(e.target.value);
    };

    const handleSubmit = () => {
        onSelectEmail(selectedEmail);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Select Account Email</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="selectEmail">
                        <Form.Label>Select which email to use for account login:</Form.Label>
                        {emails.map((email, index) => (
                            <Form.Check
                                key={index}
                                type="radio"
                                label={email}
                                value={email}
                                name="emailSelection"
                                onChange={handleEmailChange}
                                checked={selectedEmail === email}
                            />
                        ))}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Select
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EmailSelectionModal;
