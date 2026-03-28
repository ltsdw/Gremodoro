import { Injectable } from '@angular/core';

/**
 * `Logger`
 *
 * A simple logging class.
 *
 * Provides the following logging levels: `log`, `warn` and `error`.
 */
@Injectable({
    providedIn: 'root',
})
export class Logger {
    /**
     * `log`
     *
     * Logs a message to the `stdout`.
     *
     * @param message The message to be logged.
     * @param data Relevant object to be logged.
     */
    log(message: string, data?: unknown) {
        console.log('[', this.getFormattedTime(), '- LOG]', message, data);
    }

    /**
     * `warn`
     *
     * Logs a `warning` message
     *
     * @param message The message to be logged.
     * @param data Relevant object to be logged.
     */
    warn(message: string, data?: unknown) {
        console.warn('[', this.getFormattedTime(), '- WARN]', message, data);
    }

    /**
     * `error`
     *
     * Logs a `error` message
     *
     * @param message The message to be logged.
     * @param data Relevant object to be logged.
     */
    error(message: string, data?: unknown) {
        console.error('[', this.getFormattedTime(), '- ERROR]', message, data);
    }

    /**
     * `getFormattedTime`
     *
     * @returns `string` A formatted time as in "HH:MM:SS.MS".
     */
    private getFormattedTime() {
        const now = new Date();

        return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;
    }
}
