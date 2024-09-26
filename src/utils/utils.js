import { Alert } from 'react-bootstrap'

// Using JSX for HTML Content in `message` parameter
export const AlertMessage = ({ message, state }) => {
    return (
        <Alert variant={state}>{message}</Alert>
    );
}
