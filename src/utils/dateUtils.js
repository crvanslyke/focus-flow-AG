/**
 * Returns a new Date object representing today (normalized to midnight)
 */
export const getToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

/**
 * Adds (pixels) days to a date.
 * Returns a NEW Date object.
 */
export const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

/**
 * Returns an array of Date objects starting from startDate for numDays.
 */
export const getDatesInView = (startDate, numDays) => {
    const days = [];
    for (let i = 0; i < numDays; i++) {
        days.push(addDays(startDate, i));
    }
    return days;
};

/**
 * Returns a string key 'YYYY-MM-DD' for easy comparison/storage
 */
export const formatDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

/**
 * Formats a date for display (e.g., "Mon, Dec 29")
 */
export const formatDisplayDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};
