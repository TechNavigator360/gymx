// Returns the start and end date of the current week.
// Week starts on Monday and ends on Sunday.
const getCurrentWeekRange = () => {
    const now = new Date();

    const currentDay = now.getDay();
    const daysSinceMonday = currentDay === 0 ? 6 : currentDay -1;

    const startDate = new Date(now);
    startDate.setDate(now.getDate() - daysSinceMonday);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    return {
        startDate,
        endDate,
    };
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
    formatDateOnly,
};