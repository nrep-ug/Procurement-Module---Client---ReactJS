// src/components/admin/SupplierProfileDetails.js
import {React, useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { serverURL } from '../../../configs/urls.js';
import SupplierProfile from '../profile/SupplierProfile.js';
import '../../../assets/styles/Profile.css'

const SupplierProfileDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    
    // Retrieve user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (userInfo.userType.includes('staff') === false) {
        navigate('/')
    }

    const [supplierInfo, setSupplierInfo] = useState({})
    const [loading, setLoading] = useState(true);

    // Fetch Supplier Information
    useEffect(() => {
        const fetchSupplierDetails = async () => {
            try {
                const response = await axios.get(`${serverURL}/api/procure/get-supplier/${id}`);
                setSupplierInfo(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching procurement details:', error);
                setLoading(false);
            }
        };

        fetchSupplierDetails();
    }, [id]);

    //Set loader on initial load of the component
    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    // Check if supplier information exists
    if (Object.keys(supplierInfo).length === 0) {
        return (
            <Container fluid className="d-flex flex-column justify-content-center align-items-center min-vh-100">
                <Alert variant="warning"><h1>No Supplier information available.</h1></Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="d-flex flex-column justify-content-center align-items-center min-vh-100">
                <SupplierProfile supplier={supplierInfo} />
        </Container>
    );
};

export default SupplierProfileDetails;
