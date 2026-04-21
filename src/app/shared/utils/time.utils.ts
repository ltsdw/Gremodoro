/**
 * `formatTime`
 *
 * Formats a time value (in seconds) into a string in "mm:ss" format.
 *
 * @param value - Time in seconds.
 * @returns A string representing the formatted time (e.g., "02:05").
 */
export function formatTime(value: number): string {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');

    return `${minutesStr}:${secondsStr}`;
}
