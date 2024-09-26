// src/pages/Application.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Button, ListGroup } from 'react-bootstrap';
import Loader from '../components/common/Loader.js'
import ProcurementApplication from '../components/specific/ProcurementApplication.js';

const Application = () => {
    // const { serviceID } = useParams()

    const [loading, setLoading] = useState(true);

    if (loading) {
        return <Loader />
    }

    return (
        <Container>
            <ProcurementApplication />
        </Container>
    );
};

export default Application;
