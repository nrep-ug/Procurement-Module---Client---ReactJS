// src/pages/Home.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Button, ListGroup, Modal } from 'react-bootstrap';
import ProcurementList from '../components/specific/ProcurementList.js'

const Home = () => {

    return (
        <Container>
            <ProcurementList />
        </Container>
    );
};

export default Home;
