// src/pages/SupplierListPage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Button, ListGroup, Modal } from 'react-bootstrap';
import SuppliersList from '../components/specific/admin/SuppliersList.js'

const SupplierListPage = () => {

    return (
        <Container>
            <SuppliersList />
        </Container>
    );
};

export default SupplierListPage;
