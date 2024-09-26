// src/components/specific/ProcurementPost.js

import React from 'react';
import { Card, ListGroup, Row, Col } from 'react-bootstrap';

const ProcurementPost = ({ data }) => {
    return (
        <Card className="mb-4">
            <Card.Header as="h3">{data.procurementTitle}</Card.Header>
            <Card.Body>
                <Row className="mb-3">
                    <Col>
                        <strong>Reference Number:</strong> {data.referenceNumber}
                    </Col>
                    <Col>
                        <strong>RFP Issuance Date:</strong> {data.issuanceDate}
                    </Col>
                </Row>

                <Card.Title>Introduction</Card.Title>
                <Card.Text>{data.introduction}</Card.Text>

                <Card.Title>Scope of Work / Description</Card.Title>
                <Card.Text>{data.scopeOfWork}</Card.Text>

                {data.deliverables && data.deliverables.length > 0 && (
                    <>
                        <Card.Title>Deliverables</Card.Title>
                        <ListGroup variant="flush">
                            {data.deliverables.map((item, index) => (
                                <ListGroup.Item key={index}>{item}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </>
                )}

                {data.submissionRequirements && data.submissionRequirements.length > 0 && (
                    <>
                        <Card.Title>Submission Requirements</Card.Title>
                        <ListGroup variant="flush">
                            {data.submissionRequirements.map((item, index) => (
                                <ListGroup.Item key={index}>{item}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </>
                )}

                {data.evaluationCriteria && data.evaluationCriteria.length > 0 && (
                    <>
                        <Card.Title>Evaluation Criteria</Card.Title>
                        <ListGroup variant="flush">
                            {data.evaluationCriteria.map((item, index) => (
                                <ListGroup.Item key={index}>{item}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </>
                )}

                {data.termsAndConditions && data.termsAndConditions.length > 0 && (
                    <>
                        <Card.Title>Terms and Conditions</Card.Title>
                        <ListGroup variant="flush">
                            {data.termsAndConditions.map((item, index) => (
                                <ListGroup.Item key={index}>{item}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </>
                )}

                <Row className="mt-4">
                    <Col>
                        <strong>Submission Deadline:</strong> {data.submissionDeadline}
                    </Col>
                    <Col>
                        <strong>Questions Deadline:</strong> {data.questionsDeadline}
                    </Col>
                    <Col>
                        <strong>Contract Award Date:</strong> {data.contractAwardDate}
                    </Col>
                </Row>

                <Card.Title className="mt-4">Contact Information</Card.Title>
                <Card.Text>{data.contactInformation}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default ProcurementPost;
