// src/utils/dateUtils.js

import moment from 'moment-timezone';

// Returned format is e.g. 31-08-2024
export const formatDate = (date, format = 'DD-MM-YYYY') => {
    return moment(date).format(format);
};

// Returned format is e.g. 12th/Aug/2024
export const formatDate2 = (dateString) => {
    return moment(dateString).format('Do/MMMM/YYYY'); // 'Do' adds the ordinal suffix to the date
};

/**
 * Compares a given date/time string with the current date/time.
 * @param {string} dateTimeStr - The date/time string to compare.
 * @param {string} comparison - 'before' or 'after'.
 * @returns {boolean} - Returns true if the condition is met, false otherwise.
 * @throws {Error} - Throws error if the date/time string is invalid or comparison parameter is incorrect.
 */
export function compareDateTime(dateTimeStr, comparison) {
    const inputDateTime = moment(dateTimeStr);
    const now = moment();

    if (!inputDateTime.isValid()) {
        throw new Error('Invalid date/time format');
    }

    if (comparison === 'before') {
        return inputDateTime.isBefore(now);
    } else if (comparison === 'after') {
        return inputDateTime.isAfter(now);
    } else {
        throw new Error("Comparison parameter must be 'before' or 'after'");
    }
}