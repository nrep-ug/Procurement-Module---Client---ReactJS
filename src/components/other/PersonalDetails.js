import React from 'react';
import { Form, Col, Row, Card } from 'react-bootstrap';
import Select from 'react-select';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { BoldFormLabel } from '../../customComponents/reactBootstrap';

const PersonalDetails = ({ hrStyle, formData, handleChange, handleDateChange, handleNationalityChange, genderOptions, countries }) => {
    let dob = formData.dob;
    const formattedDOB = dob ? dob.toLocaleDateString() : ''; // Format the date before rendering

    return (
        <Card className="shadow-lg p-4" style={{ backgroundColor: "#fbffff" }}>
            <Card.Footer>PERSONAL DETAILS</Card.Footer>
            <Card.Body>
                <Row>
                    <Col md={6} className="mb-3">
                        <Form.Group controlId="formFirstName">
                            <BoldFormLabel required={true}>First Name</BoldFormLabel>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group controlId="formSurName">
                            <BoldFormLabel required={true}>Surname</BoldFormLabel>
                            <Form.Control
                                type="text"
                                name="surName"
                                value={formData.surName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group controlId="formMiddleName">
                            <BoldFormLabel required={false}>Middle Name</BoldFormLabel>
                            <Form.Control
                                type="text"
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <hr style={hrStyle} />

                <Form.Group controlId="formGender">
                    <BoldFormLabel required={true}>Gender</BoldFormLabel>
                    <Form.Control
                        as="select"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select gender</option>
                        {genderOptions.map((gender) => (
                            <option key={gender.value} value={gender.value}>
                                {gender.label}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <hr style={hrStyle} />

                <Form.Group controlId="formNationality">
                    <BoldFormLabel required={true}>Nationality</BoldFormLabel>
                    <div className='mt-2'>Selected Country: {formData.nationality}</div>
                    <Select
                        options={countries}
                        onChange={handleNationalityChange}
                        defaultValue={formData.nationality}
                        required
                    />
                </Form.Group>

                <hr style={hrStyle} />

                <Form.Group controlId="formDOB">
                    <BoldFormLabel required={true}>Date of Birth</BoldFormLabel>
                    <div>Selected Date: <i>{formattedDOB}</i></div> {/* Render formatted date */}
                    <Calendar
                        selected={formData.dob}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                        defaultView="year"
                        required
                    />
                </Form.Group>
            </Card.Body>
        </Card>
    );
};

export default PersonalDetails;
