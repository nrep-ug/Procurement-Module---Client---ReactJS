// src/components/common/FileUploadComponent.js

import React, { useState, useEffect } from 'react';
import { Form, Alert } from 'react-bootstrap';

const FileUploadComponent = ({ label = null, fileType = [], maxSize = 5, onFileUpload, multiple = false, }) => {
    const [error, setError] = useState(null);
    const acceptedFileTypes = fileType.join(', ');

    // useEffect(() => {
    // },[]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
            const fileSizeInMB = selectedFile.size / 1024 / 1024;

            if (fileType.length && !fileType.includes(fileExtension)) {
                setError(`File type must be one of the following: ${fileType.join(', ')}`);
                return;
            }

            if (fileSizeInMB > maxSize) {
                setError(`File size must be less than ${maxSize}MB`);
                return;
            }

            setError(null);
            onFileUpload(selectedFile);  // Return the selected file to the parent component
        }
    };

    return (
        <Form.Group>
            <Form.Label htmlFor="fileUpload">{label === null ? 'Upload File' : label}</Form.Label>
            <Form.Control
                type="file"
                id="fileUpload"
                multiple={multiple}
                onChange={handleFileChange}
            />
            <i>Accepted File Types: {acceptedFileTypes}</i>
            {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
        </Form.Group>
    );
};

export default FileUploadComponent;
