import React, { useState } from 'react';
import { Container, Button, Image } from 'react-bootstrap';
import countryList from 'react-select-country-list';
import PersonalDetails from './PersonalDetails';
import ContactDetails from './ContactDetails';
import WorkDetails from './WorkDetails';
import { AlertMessage } from '../../utils/utils';

const WorkForm = () => {

    const hrStyle = {
        border: '1px solid orange',
        margin: '0.8rem 0',
        width: '100%'
    };

    const [step, setStep] = useState(1);
    const [errMessage, setErrMessage] = useState('');
    const [formData, setFormData] = useState({
        staffID: '',
        staffCategory: '',
        staffCategory: '',
        roles: '',
        firstName: '',
        surName: '',
        middleName: '',
        gender: '',
        email1: '',
        email2: '',
        email3: '',
        phone1: '',
        phone2: '',
        phone3: '',
        dob: null,
        NIN: '',
        TIN: '',
        NSSF: '',
        nationality: '',
        address1: '',
        address2: '',
    });

    const countries = countryList().getData();

    const staffCategories = [
        { label: 'Full Staff', value: 'FullStaff' },
        { label: 'Intern', value: 'Intern' },
        { label: 'Associate', value: 'Associate' },
        // { label: 'Other', value: 'Other' },
    ];

    const genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePhoneChange = (value, name) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            dob: date,
        });
    };

    const handleNationalityChange = (selectedOption) => {
        setFormData({
            ...formData,
            nationality: selectedOption.label,
        });
    };

    const validateStep = () => {
        switch (step) {
            case 1:
                return (
                    formData.firstName.trim() !== '' &&
                    formData.surName.trim() !== '' &&
                    formData.gender.trim() !== '' &&
                    formData.dob !== null &&
                    formData.nationality.trim() !== ''
                );
            case 2:
                return (
                    formData.email1.trim() !== '' &&
                    formData.phone1.trim() !== '' &&
                    formData.address1.trim() !== ''
                );
            case 3:
                return (
                    formData.staffID.trim() !== '' &&
                    formData.staffCategory.trim() !== '' &&
                    formData.roles.trim() !== ''
                );
            default:
                return true;
        }
    };

    const nextStep = () => {
        setErrMessage('');
        if (validateStep()) {
            setStep(step + 1);
        } else {
            setErrMessage(
                <>
                    Please fill in all required fields marked <i><b>Required</b></i> before proceeding.
                </>
            );
        }
    };

    const prevStep = () => {
        setErrMessage('');
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateStep()) {
            const cleanedFormData = cleanFormData(formData);

            console.log('Cleaned Form Data: ', cleanedFormData);
            const response = await fetch('http://localhost:3005/api/staff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanedFormData),
            });

            if (response.ok) {
                alert('Form submitted successfully!');
            } else {
                alert('Form submission failed.');
            }
        } else {
            alert('Please fill in all required fields.');
        }
    };

    const cleanFormData = (data) => {
        const cleanedData = {};
        for (const key in data) {
            if (data[key] === '') {
                cleanedData[key] = null;
            } else {
                cleanedData[key] = data[key];
            }
            if (key === 'roles') {
                cleanedData[key] = [data[key]];
            }
        }
        return cleanedData;
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <PersonalDetails
                    formData={formData}
                    handleChange={handleChange}
                    handleDateChange={handleDateChange}
                    handleNationalityChange={handleNationalityChange}
                    genderOptions={genderOptions}
                    countries={countries}
                    hrStyle={hrStyle}
                />;
            case 2:
                return <ContactDetails
                    formData={formData}
                    handleChange={handleChange}
                    handlePhoneChange={handlePhoneChange}
                    hrStyle={hrStyle}
                />;
            case 3:
                return <WorkDetails
                    formData={formData}
                    handleChange={handleChange}
                    staffCategories={staffCategories}
                    hrStyle={hrStyle}
                />;
            default:
                return <PersonalDetails />;
        }
    };

    return (
        <Container className="my-5">
            {/* <div
                style={{ alignSelf: 'center' }}
                className="d-flex justify-content-center"
            >
                <Image
                    src="/images/nrep-1.png"
                    fluid
                    alt="The National Renewable Energy Platform (NREP)"
                    style={{ width: '15rem', height: 'auto' }}
                />
            </div> */}
            <h3 className="text-center mb-4">Staff Details</h3>
            <form onSubmit={handleSubmit}>
                {renderStep()}
                <div className="mt-4">
                    {
                        errMessage !== '' &&
                        AlertMessage({ message: errMessage, state: 'danger' })
                    }
                </div>
                {step === 3 && (
                    <div className="mt-4 d-flex justify-content-center">
                        <Button type="submit" variant="primary">
                            Submit
                        </Button>
                    </div>
                )}
            </form>
            <div className="mt-4 d-flex justify-content-between">
                {step > 1 && (
                    <Button type="button" variant="secondary" onClick={prevStep}>
                        Previous
                    </Button>
                )}
                {step < 3 && (
                    <Button type="button" variant="primary" onClick={nextStep}>
                        Next
                    </Button>
                )}
            </div>
        </Container>
    );
};

export default WorkForm;
