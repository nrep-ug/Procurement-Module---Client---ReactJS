// src/services/api.js
import axios from 'axios';
import { serverURL } from '../configs/urls.js';
import qs from 'qs';

// Retrieve user info from localStorage
const userInfo = JSON.parse(localStorage.getItem('userInfo'));

// USER/STAFF APIs
export const fetchUsers = async () => {
    try {
        const response = await fetch(`${serverURL}/api/staff/all-staff/`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

//Create supplier account
export const createSupplierAccount = async (formData) => {
    try {
        console.log('Creating supplier account: ', formData);
        const response = await axios.post(`${serverURL}/api/procure/supplier-register`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        let message;
        if (error.response) {
            console.error('Server responded with an error:', error.response.data.message);
            message = error.response.data.message;
        } else {
            console.error('Error creating supplier account:', error.message);
            message = error.message ? error.message : 'Unknown error occured. Contact support.';
        }
        throw new Error(message);
    }
};

// Supplier Applied to servvices
export const getAppliedToServices = async (supplierID) => {
    try {
        const response = await fetch(`${serverURL}/api/procure/applied?supplierID=${supplierID}`);
        const data = await response.json()
        console.log('Categories: ', data);
        return await data;
    } catch (error) {
        console.error('Error fetching procurement categories:', error);
        return { success: false };
    }
};

// Applied to service details
export const fetchServiceDetails = async (serviceID, supplierID) => {
    try {
        const response = await fetch(`${serverURL}/api/procure/applied/service-details?supplierID=${supplierID}&serviceID=${serviceID}`);
        if (!response.ok) {
            throw new Error('Failed to fetch service details');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching service details:', error);
        throw error;
    }
};

// Update Status for applied to service
// In api.js
export const handleUpdateStatusAppliedService = async (updateData, serviceDetails) => {
    try {
        console.log('Data to update: ',updateData)
        const response = await axios.put(
            `${serverURL}/api/procure/applied/${serviceDetails.applicationID}/status-update`,
            updateData
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

// category api
export const fetchCategories = async () => {
    try {
        const response = await fetch(`${serverURL}/api/procure/get-categories`);
        const data = await response.json()
        console.log('Categories: ', data);
        return await data.documents;
    } catch (error) {
        console.error('Error fetching procurement categories:', error);
        return [];
    }
};

export const submitProcurePost = async (data) => {
    try {
        // Send form data as multipart/form-data
        const response = await axios.post(`${serverURL}/api/procure/add-service`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response
    } catch (error) {
        console.error('Error submitting procurement post: ', error);
    }
};

//Document View
export const fetchDocumentPreview = async (documentId) => {
    try {
        const response = await fetch(`${serverURL}/api/procure/document/view/${documentId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch document');
        }

        // Read the response as an ArrayBuffer
        const arrayBuffer = await response.arrayBuffer();

        // Convert the ArrayBuffer to a Blob
        const blob = new Blob([arrayBuffer], { type: response.headers.get('Content-Type') });

        // Create a URL for the Blob
        const fileURL = URL.createObjectURL(blob);

        // Extract filename from Content-Disposition header if available
        const contentDisposition = response.headers.get('Content-Disposition');
        const fileNameMatch = contentDisposition ? contentDisposition.match(/filename="(.+)"/) : null;
        const fileName = fileNameMatch ? fileNameMatch[1] : 'downloaded-file';

        return { fileURL, fileName };
    } catch (error) {
        console.error('Error fetching document preview:', error);
        throw error;
    }
};

// Return all the posted procurement opportunities
export const allProcurementOpportunities = async (page, statuses) => {
    try {
        console.log(statuses)
        const response = await axios.get(`${serverURL}/api/procure/services/pages/status`, {
            params: {
                page,
                statuses, // Pass the statuses array directly
            },
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: 'repeat' });
            },
        });
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error fetching procurement posts:', error);
        return [];
    }
};


// PROJECT APIs

export const fetchProjects = async () => {
    try {
        const response = await fetch(`${serverURL}/api/projects/all-projects/`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching projcets:', error);
        return [];
    }
}

export const fetchProjectDetails = async (projectID) => {
    try {
        const response = await fetch(`${serverURL}/api/projects/${projectID}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching project details:', error);
        return null;
    }
};

export const fetchProjectTeam = async (projectID) => {
    try {
        const response = await fetch(`${serverURL}/api/projects/${projectID}/team`);
        const data = await response.json();
        return { members: data.documents };
    } catch (error) {
        console.error('Error fetching team members:', error);
        return { members: [] };
    }
};

export const addTeamMembers = async (projectID, members) => {
    try {
        console.log('adding team members: ', members);
        const response = await fetch(`${serverURL}/api/projects/${projectID}/add-members`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ projectID, members })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding team members:', error);
        throw error;
    }
};

// PROJECT TASK APIs
export const fetchProjectTasks = async (projectID) => {
    try {
        const response = await fetch(`${serverURL}/api/projects/${projectID}/tasks/`);
        const data = await response.json();
        console.log(data);
        if (data.documents.length > 0) {

            return { tasks: data.documents };
        }
        else {
            return { tasks: [] }
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return { tasks: [] };
    }
};

export const fetchTaskDetails = async (projectID, taskID) => {
    try {
        const response = await fetch(`${serverURL}/api/projects/${projectID}/tasks/${taskID}`);
        const data = await response.json();
        // console.log('Returned task details: ', data);
        return data.documents[0];
    } catch (error) {
        console.error('Error fetching task details:', error);
        return null;
    }
};

export const createTask = async (taskData) => {
    try {
        console.log('Creating task ... ', taskData);
        const response = await fetch(`${serverURL}/api/projects/${taskData.projectID}/tasks/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([taskData])
        });
        const data = await response.json();

        // console.log('Created task: ', data);

        return { success: true, task: data.task };
    } catch (error) {
        console.error('Error creating task:', error);
        return { success: false };
    }
};

export const assignTaskMembers = async (projectID, taskID, members) => {
    try {
        console.log('Assigning task members: ', members);
        const response = await fetch(`${serverURL}/api/projects/${projectID}/tasks/${taskID}/assign-members`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ members })
        });
        return await response.json();
    } catch (error) {
        console.error('Error assigning members to task:', error);
        throw error;
    }
};

export const fetchProjectTaskTeam = async (projectID, taskID) => {
    try {
        const response = await fetch(`${serverURL}/api/projects/${projectID}/tasks/${taskID}/members`);
        const data = await response.json();
        return data.documents; // Assuming the API returns { members: [...] }
    } catch (error) {
        console.error('Error fetching task members:', error);
        return [];
    }
};
