// src/components/common/Loader.js

import React from 'react';
import { Spinner } from 'react-bootstrap';
import '../../assets/styles/Loader.css';

const Loader = () => {
    return (
        <div className="loader-container">
            <Spinner animation="grow" variant="secondary" />
            <Spinner animation="grow" variant="success" />
            <Spinner animation="grow" variant="warning" />
            <Spinner animation="grow" variant="info" />
        </div>
    );
};

export default Loader;
