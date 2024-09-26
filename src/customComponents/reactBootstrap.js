import React from 'react';
import { Form } from 'react-bootstrap';

export const BoldFormLabel = ({ children, required = false, ...props }) => {
    return (
        <Form.Label {...props} style={{ fontWeight: 'bold' }}>
            {children} {required && <b style={{ color: "red" }}>*</b>}
        </Form.Label>
    );
};
