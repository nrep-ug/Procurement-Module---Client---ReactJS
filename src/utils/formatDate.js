// src/utils/dateUtils.js

import moment from 'moment-timezone';

export const formatDate = (date, format = 'YYYY-MM-DD') => {
    return moment(date).format(format);
};

// 12th/Aug/2024
export const formatDate2 = (dateString) => {
    return moment(dateString).format('Do/MMMM/YYYY'); // 'Do' adds the ordinal suffix to the date
};