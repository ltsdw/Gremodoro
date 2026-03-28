import { Injectable, signal, inject, WritableSignal } from '@angular/core';
import {
    TimerState,
    TimerIdle,
    TimerRunning,
    TimerPaused,
    TimerExpired,
    getNewTimer,
} from '../models/timer-states';

import { TimerEvent } from '../models/timer-events';

import { Logger } from './logger';

/**
 * `Timer`
 *
 * A service that signals its duration changes to components that uses it.
 */
@Injectable({
    providedIn: 'root',
})
export class Timer {
    private logger = inject(Logger);
    timeLeft: WritableSignal<number> = signal<number>(1500);
    timer: WritableSignal<TimerState> = signal<TimerState>(
        getNewTimer(1500, { publish: (event: TimerEvent) => this.handleDomainEvents(event) }, 1000),
    );

    handleDomainEvents(event: TimerEvent) {
        switch (event.type) {
            case 'TICKED':
                this.timeLeft.set(event.timeLeft);
                break;
            case 'TIMEDOUT':
                this.timer.set((this.timer() as TimerRunning).expire());
                break;
        }
    }

    /**
     * `startTimer`
     *
     * Starts the timer if its state is either `TimerIdle` or `TimerPaused`. Otherwise nothing is done.
     */
    startTimer() {
        if (!(this.timer() instanceof TimerIdle || this.timer() instanceof TimerPaused)) {
            this.logger.error(
                'Cannot start the timer. Timer state is not Idle or Paused.',
                this.timer,
            );

            return;
        }

        const currentState = (this.timer() as TimerIdle).start();

        this.timer.set(currentState);
    }

    /**
     * `pauseTimer`
     *
     * Pauses the timer if its state is `TimerRunning`. Otherwise nothing is done.
     */
    pauseTimer() {
        if (!(this.timer() instanceof TimerRunning)) {
            this.logger.error('Cannot pause the timer. Timer state is not Running.', this.timer);

            return;
        }

        const currentState = (this.timer() as TimerRunning).pause();

        this.timer.set(currentState);
    }

    /**
     * `resetTimer`
     *
     * Resets the timer to its initial time and state.
     */
    resetTimer() {
        if (this.timer() instanceof TimerIdle) {
            this.logger.log('Timer is already Idle.', this.timer);

            return;
        }

        const currentState = (this.timer() as TimerRunning | TimerPaused | TimerExpired).reset();

        this.timer.set(currentState);
    }
}
