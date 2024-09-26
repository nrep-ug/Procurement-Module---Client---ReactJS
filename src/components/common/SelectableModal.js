import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const SelectableModal = ({ show, handleClose, options, type, labelKey, valueKey, onSelectionChange }) => {
    const [selectedValues, setSelectedValues] = useState(type === 'checkbox' ? [] : '');

    const handleCheckboxChange = (value) => {
        setSelectedValues((prevSelected) => {
            if (prevSelected.includes(value)) {
                return prevSelected.filter((item) => item !== value);
            } else {
                return [...prevSelected, value];
            }
        });
    };

    const handleRadioChange = (value) => {
        setSelectedValues(value);
    };

    const handleSave = () => {
        onSelectionChange(selectedValues);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Select Options</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {options.map((option) => (
                        <Form.Group key={option[valueKey]} controlId={option[valueKey]}>
                            <Form.Check
                                type={type}
                                label={option[labelKey]}
                                value={option[valueKey]}
                                checked={type === 'checkbox' ? selectedValues.includes(option[valueKey]) : selectedValues === option[valueKey]}
                                onChange={() => {
                                    type === 'checkbox'
                                        ? handleCheckboxChange(option[valueKey])
                                        : handleRadioChange(option[valueKey]);
                                }}
                            />
                        </Form.Group>
                    ))}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Selection
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SelectableModal;
