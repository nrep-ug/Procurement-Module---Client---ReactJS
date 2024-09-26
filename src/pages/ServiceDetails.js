// src/pages/ProjectTeam.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Button, ListGroup } from 'react-bootstrap';
import ProcurementDetails from '../components/specific/ProcurementDetails.js'
import Loader from '../components/common/Loader.js'

const ServiceDetails = () => {
    const [loading, setLoading] = useState(true);

    if (loading) {
        return <Loader />
    }

    return (
        <Container>
            <ProcurementDetails />
        </Container>
    );
};

export default ServiceDetails;
