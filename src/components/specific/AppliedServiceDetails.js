import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Card, Container, ListGroup, Spinner, Alert, Badge, Button, Row, Col, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileAlt,
  faCircle,
  faCalendarAlt,
  faFile,
  faIdBadge,
  faClipboardCheck,
  faCommentDots,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import { fetchServiceDetails, handleUpdateStatusAppliedService } from '../../services/api';
import { appwriteEndpoint, appwriteProjectID } from '../../configs/urls.js';
import UpdateStatusModal from './applications/UpdateStatusModal';
import '../../assets/styles/AppliedServiceDetails.css';

const AppliedServiceDetails = () => {
  // Retrieve user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const { serviceID } = useParams();
  const location = useLocation();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state) {
      setServiceDetails(location.state);
      setLoading(false);
    } else {
      const fetchDetails = async () => {
        try {
          const data = await fetchServiceDetails(serviceID);
          setServiceDetails(data);
        } catch (error) {
          setError('Error fetching service details. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    }
  }, [location.state, serviceID]);

  const handleUpdateStatus = async (updateData) => {
    try {
      const response = await handleUpdateStatusAppliedService(updateData, serviceDetails);
  
      setServiceDetails((prevDetails) => ({
        ...prevDetails,
        status: updateData.status,
        comments: updateData.comments,
        updatedAt: new Date().toISOString(),
      }));
  
      // Optionally, display a success message
      alert('Application status updated successfully.');
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status. Please try again.');
    }
  };  

  const parseDocuments = (documents) => {
    try {
      return documents.map((doc) => JSON.parse(doc));
    } catch (error) {
      console.error('Error parsing documents:', error);
      return [];
    }
  };

  const handleFileDownload = async (document) => {
    try {
      const fileURL = `${appwriteEndpoint}/storage/buckets/${document.bucketId}/files/${document.$id}/download?project=${appwriteProjectID}`;
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error('Error Downloading File:', error);
      alert('Unable to download file. Please try again later, or contact support.');
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!serviceDetails) {
    return null;
  }

  const parsedDocuments = parseDocuments(serviceDetails.submittedDocuments);

  // Function to format the date
  const formatDate = (date) => new Date(date).toLocaleString();

  // Determine status color
  const getStatusVariant = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'warning';
    }
  };

  return (
    <Container className="applied-service-details-container mt-4 mb-4">
      <Card className="shadow-sm">
        <Card.Header className="text-center bg-primary text-white">
          <h3 className="mb-0">
            <FontAwesomeIcon icon={faFileAlt} className="me-2" />
            Service Application Details
          </h3>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <FontAwesomeIcon icon={faIdBadge} className="me-2 text-primary" />
                  <strong>Application ID:</strong> {serviceDetails.applicationID}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FontAwesomeIcon icon={faClipboardCheck} className="me-2 text-primary" />
                  <strong>Procurement Ref. No.:</strong> {serviceDetails.postID}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-primary" />
                  <strong>Last Updated:</strong> {formatDate(serviceDetails.updatedAt)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FontAwesomeIcon icon={faCircle} className="me-2 text-primary" />
                  <strong>Status:</strong>{' '}
                  <Badge bg={getStatusVariant(serviceDetails.status)} className="status-badge">
                    {serviceDetails.status.charAt(0).toUpperCase() + serviceDetails.status.slice(1)}
                  </Badge>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={6}>
              <Card className="documents-card">
                <Card.Header className="bg-secondary text-white">
                  <FontAwesomeIcon icon={faFile} className="me-2" />
                  Submitted Documents
                </Card.Header>
                <ListGroup variant="flush">
                  {parsedDocuments.map((doc) => (
                    <ListGroup.Item key={doc.$id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <FontAwesomeIcon icon={faFileAlt} className="me-2 text-secondary" />
                        {doc.name} ({(doc.sizeOriginal / 1024).toFixed(2)} KB)
                      </div>
                      <Button variant="outline-primary" size="sm" onClick={() => handleFileDownload(doc)}>
                        <FontAwesomeIcon icon={faDownload} className="me-1" />
                        Download
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            </Col>
          </Row>
          {serviceDetails.comments && (
            <Row className="mt-4">
              <Col>
                <Card className="comments-card">
                  <Card.Header className="bg-info text-white">
                    <FontAwesomeIcon icon={faCommentDots} className="me-2" />
                    Comments
                  </Card.Header>
                  <Card.Body>
                    <p>{serviceDetails.comments}</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Card.Body>
        {userInfo.userType.includes('staff') && (
          <Card.Footer className="text-end">
            <Button variant="warning" onClick={() => setShowUpdateModal(true)}>
              Update Supplier Application Status
            </Button>
          </Card.Footer>
        )}
      </Card>
      {/* Include the modal component */}
      <UpdateStatusModal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        onUpdate={handleUpdateStatus}
        currentStatus={serviceDetails.status}
      />
    </Container>
  );
};

export default AppliedServiceDetails;
