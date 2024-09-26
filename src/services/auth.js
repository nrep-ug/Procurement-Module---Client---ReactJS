// src/services/auth.js

import { serverURL } from '../configs/urls.js';

// AUTHENTICATION SERVICES
export const signin = async (email, password, userType) => {
    try {
        const response = await fetch(`${serverURL}/api/procure/sign-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, userType: [userType] }), // Sending credentials in the body
        });

        if (!response.ok) {
            throw new Error('Sign-in failed');
        }

        return response;
    } catch (error) {
        console.error('Error during sign-in:', error);
        return { ok: false }; // Return a default response in case of failure
    }
};

export const requestPasswordReset = async (email) => {
    try {
        const response = await fetch(`${serverURL}/api/procure/request-password-reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        console.log(response);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error requesting password reset:', error);
        return { success: false, message: 'Error requesting password reset' };
    }
};

export const validateOtpForPasswordReset = async (email, code) => {
    try {
        const response = await fetch(`${serverURL}/api/procure/validate-otp-password-reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, code }),
        });

        console.log('OTP validation response: ', response);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error validating OTP:', error);
        return { success: false, message: 'Error validating OTP' };
    }
};

export const setNewPassword = async (email, code, newPassword) => {
    try {
        const response = await fetch(`${serverURL}/api/procure/set-new-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, code, newPassword }),
        });

        console.log(response);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error setting new password:', error);
        return { success: false, message: 'Error setting new password' };
    }
};
