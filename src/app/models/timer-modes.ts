import { Brand } from './brand';

/**
 * `TimerMode`
 *
 * Describes which mode the timer is attending to.
 *
 * @mode `FocusTimeMode` indicates the gremodoro focus time (usually this is the timer with the longest duration).
 * @mode `ShortBreakMode` indicates the short break time (usually, well, the shortest timer).
 * @mode `LongBreakMode` indicates the break time.
 */
export type TimerMode = FocusTimeMode | ShortBreakMode | LongBreakMode;
export type FocusTimeMode = Brand<{ type: 'focusTime'; duration: number }, 'TimerMode'>;
export type ShortBreakMode = Brand<{ type: 'shortBreak'; duration: number }, 'TimerMode'>;
export type LongBreakMode = Brand<{ type: 'longBreak'; duration: number }, 'TimerMode'>;

/**
 * `factoryMode`
 *
 * A namaspace for holding factories to create objects of the desired type offered by this model.
 */
export const factoryMode = {
    focusTimeMode(duration: number): FocusTimeMode {
        return { type: 'focusTime', duration: duration } as FocusTimeMode;
    },

    shortBreakMode(duration: number): ShortBreakMode {
        return { type: 'shortBreak', duration: duration } as ShortBreakMode;
    },

    longBreakMode(duration: number): LongBreakMode {
        return { type: 'longBreak', duration: duration } as LongBreakMode;
    },
};
