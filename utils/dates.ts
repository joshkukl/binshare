// This file contains date helper functions for the application
// Uses date-and-time library for date manipulation

import { format } from 'date-and-time';

const dateFormat =format(new Date(), 'ddd, MMM DD YYYY HH:mm:ss'); // Wed, Jul 09 2025

const DateUtils = {
  formatDate: (date: Date, formatStr: string): string => {
    return format(date, formatStr);
  },
  nowDate: (): string => {
    return dateFormat;
  }
};

export default DateUtils;