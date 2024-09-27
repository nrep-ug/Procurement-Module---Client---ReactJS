// src/components/profile/Profile.js
import React from 'react';
import StaffProfile from '../components/specific/profile/StaffProfile.js';
import SupplierProfile from '../components/specific/profile/SupplierProfile.js';
import { Container, Alert } from 'react-bootstrap';
import '../assets/styles/Profile.css';

const Profile = () => {
    // Retrieve user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo) {
        return (
            <Container className="mt-4">
                <Alert variant="warning">No user information available.</Alert>
            </Container>
        );
    }

    // Determine the user type from the userInfo
    const userType = userInfo.userType.includes('staff') ? 'staff' : 'supplier';

    return (
        <Container>
            {userType === 'staff' ? (
                <StaffProfile user={userInfo} />
            ) : (
                <SupplierProfile supplier={userInfo} />
            )}
        </Container>
    );
};

export default Profile;
