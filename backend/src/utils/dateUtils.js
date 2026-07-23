// Returns the start and end date of the Monday-to-Sunday week
// containing the supplied date.
const getWeekRange = (date) => {
    const currentDay = date.getDay();
    const daysSinceMonday = currentDay === 0 ? 6 : currentDay -1;

    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() - daysSinceMonday);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    return {
        startDate,
        endDate
    };
};

// Returns the start and end date of the current week.
const getCurrentWeekRange = () => {
    return getWeekRange(new Date());
};

// Returns a new Date moved by the supplied number of weeks.
const addWeeks = (date, numberOfWeeks) => {
    const result = new Date(date);
    result.setDate(result.getDate() + numberOfWeeks * 7);

    return result;
};

// Formats a Date object as YYYY-MM-DD using local time.
const formatDateOnly = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

module.exports = {
    getCurrentWeekRange,
    getWeekRange,
    addWeeks,
    formatDateOnly,
};
