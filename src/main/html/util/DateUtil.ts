class DateUtil {
    private readonly localTimezone: string;

    constructor() {
        this.localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    formatReadableDate(utcDate: string): string {
        const date: Date = new Date(utcDate);
        return date.toLocaleString('en-US', {
            timeZone: this.localTimezone,
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    getLocalTodayForDateInput(): string {
        // Constructing a new date with no params will create a date representing now in the user's local time
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    convertUTCISOZonedDateTimeToInputLocalDate(isoDate: string): string {
        // Constructing a new date from a UTC ISO zoned datetime will automatically convert it to the user's local time
        const date: Date = new Date(isoDate);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    convertInputLocalDateToUTCISOZonedDateTime(dateInputLocalDate: string): string {
        // Constructing a new date from y/m/d params creates a new date at midnight, local user's time
        // toISOString will convert this to am ISO UTC zoned date time
        return (new Date(
            parseInt(dateInputLocalDate.slice(0,4)),
            parseInt(dateInputLocalDate.slice(5,7)) - 1,
            parseInt(dateInputLocalDate.slice(8,10)),
        )).toISOString();
    }

    getCurrentDateAsUTCISOZonedDateTime(): string {
        return this.convertInputLocalDateToUTCISOZonedDateTime(this.getLocalTodayForDateInput());
    }
}

const dateUtil: DateUtil = new DateUtil();

export default dateUtil;
