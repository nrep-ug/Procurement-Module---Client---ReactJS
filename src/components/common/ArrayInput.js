// src/components/common/ArrayInput.js

import React, { useState } from 'react';
import { Form, Button, Row, Col, ListGroup } from 'react-bootstrap';

const ArrayInput = ({ label, placeholder, onChange, required = false }) => {
    const [items, setItems] = useState(['']);

    const handleAddItem = () => {
        setItems([...items, ""]);
    };

    const handleRemoveItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        updateItems(newItems);
    };

    const handleItemChange = (value, index) => {
        const newItems = items.map((item, i) => (i === index ? value : item));
        updateItems(newItems);
    };

    const updateItems = (newItems) => {
        // Filter out empty items
        const filteredItems = newItems.filter(item => item.trim() !== "");
        setItems(filteredItems);
        onChange(filteredItems);
    };

    return (
        <Form.Group>
            <Form.Label>{label}</Form.Label>
            {items.map((item, index) => (
                <Row key={index} className="mb-2">
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder={placeholder}
                            value={item}
                            onChange={(e) => handleItemChange(e.target.value, index)}
                            required
                        />
                    </Col>
                    <Col xs="auto">
                        <Button variant="outline-danger" onClick={() => handleRemoveItem(index)}>
                            Remove
                        </Button>
                    </Col>
                </Row>
            ))}
            <Button variant="outline-success" onClick={handleAddItem}>
                Add {label} {items.length + 1}
            </Button>
        </Form.Group>
    );
};

export default ArrayInput;
