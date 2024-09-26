// src/components/common/DatePickerModal.js

import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const DatePickerModal = ({ show, handleClose, onDateSelect }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSave = () => {
        onDateSelect(selectedDate);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Select a Date</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Date
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DatePickerModal;
