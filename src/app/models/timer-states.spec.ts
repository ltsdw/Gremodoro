import {
    TimerIdle,
    TimerRunning,
    TimerPaused,
    TimerExpired,
    TimerState,
    getNewTimer,
} from './timer-states';
import { TimerEvent } from './timer-events';

describe(`Gremodoro's Finite State Machine`, () => {
    beforeEach(() => {
        vitest.useFakeTimers();
    });

    afterEach(() => {
        vitest.useRealTimers();
    });

    it('Should transition from the Idle state to the Running state when start() is called.', () => {
        const initialState = getNewTimer(1500, { publish: (_: TimerEvent) => {} }, 1000);
        const nextState = initialState.start();
        expect(nextState instanceof TimerRunning).toBeTruthy();
    });

    it('Should transition from the Running state to the Paused state when paused() is called.', () => {
        const initialState = getNewTimer(1500, { publish: (_: TimerEvent) => {} }, 1000);
        const nextState = initialState.start();
        const pausedState = nextState.pause();

        expect(pausedState instanceof TimerPaused).toBeTruthy();
        expect(pausedState.getTimeLeft(), 'Expected the paused timer to not change time.').toBe(
            1500,
        );
    });

    it('should transition from the Running state to the Idle state when reset() is called.', () => {
        const initialState = getNewTimer(1500, { publish: (_: TimerEvent) => {} }, 1000);
        const firstState = initialState.start();
        const nextState = firstState.reset();

        expect(nextState instanceof TimerIdle).toBeTruthy();
    });

    it('should transition from the Running state to the Expired state when expire() is called.', () => {
        const initialState = getNewTimer(1500, { publish: (_: TimerEvent) => {} }, 1000);
        let currentState: TimerState = initialState.start();

        vitest.advanceTimersByTime(1500 * 1000);

        if (currentState.getTimeLeft() === 0) {
            currentState = (currentState as TimerRunning).expire();
        }

        expect(currentState instanceof TimerExpired).toBeTruthy();
    });
});
