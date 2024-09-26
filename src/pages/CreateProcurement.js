// src/pages/CreateProcurement.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Button, ListGroup, Modal } from 'react-bootstrap';
import ProcurementForm from '../components/specific/ProcurementForm.js'

const CreateProcurement = () => {

    return (
        <Container>
            <ProcurementForm />
        </Container>
    );
};

export default CreateProcurement;
