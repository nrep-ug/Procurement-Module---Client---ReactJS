import React from 'react';
import { Form, Card } from 'react-bootstrap';
import { BoldFormLabel } from '../../customComponents/reactBootstrap';

const WorkDetails = ({ hrStyle, formData, handleChange, staffCategories }) => {
    return (
        <Card className="shadow-lg p-4" style={{ backgroundColor: "#fbffff" }}>
            <Card.Footer>WORK DETAILS</Card.Footer>
            <Card.Body>
                <Form.Group controlId="formStaffID">
                    <BoldFormLabel required={true}>Staff ID</BoldFormLabel>
                    <Form.Control
                        type="text"
                        name="staffID"
                        value={formData.staffID}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <hr style={hrStyle} />

                <Form.Group controlId="formStaffCategory">
                    <BoldFormLabel required={true}>Staff Category</BoldFormLabel>
                    <Form.Control
                        as="select"
                        name="staffCategory"
                        value={formData.staffCategory}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Staff Category</option>
                        {staffCategories.map((staffCategory) => (
                            <option key={staffCategory.value} value={staffCategory.value}>
                                {staffCategory.label}
                            </option>
                        ))}
                    </Form.Control>
                    {formData.staffCategory === 'Other' && (
                        <Form.Control
                            type="text"
                            name="customStaffCategory"
                            placeholder="Specify category for staff"
                            value={formData.customStaffCategory}
                            onChange={handleChange}
                            required
                        />
                    )}
                </Form.Group>

                <hr style={hrStyle} />

                <Form.Group controlId="formRoles">
                    <BoldFormLabel required={true}>Staff Responsibilities</BoldFormLabel>
                    <Form.Control
                        as="textarea"
                        name="roles"
                        value={formData.roles}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <hr style={hrStyle} />

                <Form.Group controlId="formNationalID">
                    <BoldFormLabel>National ID or Passport Number</BoldFormLabel>
                    <Form.Control
                        type="text"
                        name="NIN"
                        value={formData.NIN}
                        onChange={handleChange}
                    />
                </Form.Group>

                <hr style={hrStyle} />

                <Form.Group controlId="formTIN">
                    <BoldFormLabel>Tax Identification (TIN)</BoldFormLabel>
                    <Form.Control
                        type="number"
                        name="TIN"
                        value={formData.TIN}
                        onChange={handleChange}
                    />
                </Form.Group>

                <hr style={hrStyle} />

                <Form.Group controlId="formNSSF">
                    <BoldFormLabel>National Social Security Fund (NSSF) Number</BoldFormLabel>
                    <Form.Control
                        type="number"
                        name="NSSF"
                        value={formData.NSSF}
                        onChange={handleChange}
                    />
                </Form.Group>
            </Card.Body>
        </Card>
    );
};

export default WorkDetails;
