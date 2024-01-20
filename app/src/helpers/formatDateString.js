export function formatDateString(date) {
    return new Intl.DateTimeFormat('en-US', {
        weekday: "short",
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short"
    }).format(new Date(date));
};

export function dateSelected(date) {
    return /\D/.test(date[0]) && /\D/.test(date);
}

export function formatDate(date) {
    if (dateSelected(date)) {
        return '';
    } else {
        return new Intl.DateTimeFormat('en-US', {
            weekday: "short",
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZoneName: "short"
        }).format(new Date(date));
    }
}
