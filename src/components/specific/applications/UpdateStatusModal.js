// src/components/specific/applications/UpdateStatusModal.js
import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const UpdateStatusModal = ({ show, onHide, onUpdate, currentStatus }) => {
  const [status, setStatus] = useState(currentStatus);
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'needs_more_info', label: 'Needs More Information' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onUpdate({ status, comments });
    } catch (err) {
      setError('Failed to update status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Update Application Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group controlId="statusSelect">
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="commentsTextarea" className="mt-3">
            <Form.Label>Comments</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter any comments or notes"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Status'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateStatusModal;
