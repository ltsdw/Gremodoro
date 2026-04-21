/**
 * `GremodoroSettings`
 *
 * Stores the application settings.
 *
 * @property `focusTime` tells how long to focus before transitioning to a short/long break.
 * @property `shortBreak` tells how long the short break will last.
 * @property `longBreak` tells how long the long break will last.
 */
export interface GremodoroSettings {
    focusTime: number;
    shortBreak: number;
    longBreak: number;
}

/**
 * `DEFAULT_SETTINGS`
 *
 * A constant for default settings, in case there's no settings at all or they're invalid.
 *
 * @property `focusTime` **Defaults** (25 minutes).
 * @property `shortBreak` **Defaults** (5 minutes).
 * @property `longBreak` **Defaults** (15 minutes).
 */
export const DEFAULT_SETTINGS: GremodoroSettings = {
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
} as const;
