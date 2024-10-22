import { Alert } from 'react-bootstrap'

// Using JSX for HTML Content in `message` parameter
export const AlertMessage = ({ message, state }) => {
    return (
        <Alert variant={state}>{message}</Alert>
    );
}

// Application status return
export const applicationStatus = (status) => {
    const statusMap = {
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        under_review: 'Under Review',
        on_hold: 'On Hold',
        needs_more_info: 'More Information Needed'
    };
    
    return statusMap[status] || null;
};

