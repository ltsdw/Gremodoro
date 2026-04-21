import { Injectable, signal, inject, effect, untracked, WritableSignal } from '@angular/core';

import {
    TimerState,
    TimerIdle,
    TimerRunning,
    TimerPaused,
    TimerExpired,
    getTimerWithContext,
} from '../models/timer-states';
import { GremodoroSettings as GremodoroSettingsService } from './gremodoro-settings';
import { GremodoroSettings } from '../models/gremodoro-settings';
import { TimerContext } from '../models/timer-events';
import { Audio } from './audio';

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
    private audioService = inject(Audio);
    private logger = inject(Logger);
    //* TODO: move this somewhere else.
    private settings = inject(GremodoroSettingsService);
    private timerContext: TimerContext = {
        // We get the time in minutes, we must convert to seconds as internally the timer expects time in seconds.
        initialTime: this.settings.settings().focusTime * 60,
        timeLeft: this.settings.settings().focusTime * 60,
        delay: 1000,
        publisher: { publish: (event: TimerEvent) => this.handleDomainEvents(event) },
    };
    initialTime: WritableSignal<number> = signal<number>(this.timerContext.initialTime);
    timeLeft: WritableSignal<number> = signal<number>(this.timerContext.timeLeft);
    timer: WritableSignal<TimerState> = signal<TimerState>(getTimerWithContext(this.timerContext));

    constructor() {
        effect(() => {
            const newSettings = this.settings.settings();
            /*
             * Let's not cause a deadlock here by updating the signal and reacting to the change at the same time.
             */
            untracked(() => {
                this.syncSettings(newSettings);
            });
        });
    }

    /**
     * `setupTimer`
     *
     * Configures a new idled timer with `time` seconds.
     * This should be called before using this service.
     *
     * @param time Value in seconds to set the duration of the timer.
     */
    setupTimer(time: number) {
        this.timerContext.timeLeft = time;
        this.timerContext.initialTime = time;
        this.timer().destroy();
        this.timer.set(getTimerWithContext(this.timerContext));
        this.timeLeft.set(time);
        this.initialTime.set(time);
    }

    /**
     * TODO: move this somewhere else.
     * `syncSettings`
     *
     * @param gremodoroSettings the new settings to synchronize with internal state.
     */
    private syncSettings(gremodoroSettings: GremodoroSettings) {
        this.timerContext.initialTime = gremodoroSettings.focusTime * 60;
        this.timerContext.timeLeft = gremodoroSettings.focusTime * 60;

        if (this.timer() instanceof TimerIdle) {
            this.timer.set(getTimerWithContext(this.timerContext));
            this.timeLeft.set(this.timerContext.timeLeft);
            this.initialTime.set(this.timerContext.initialTime);
        }
    }

    /**
     * `handleDomainEvents`
     *
     * A method for handling the timer events.
     *
     * @param event An event that needs to be handled.
     */
    private handleDomainEvents(event: TimerEvent) {
        switch (event.type) {
            case 'ticked':
                this.timeLeft.set(event.timeLeft);
                break;
            case 'expired':
                this.onTimerExpired();
                break;
        }
    }

    /**
     * `onTimerExpired`
     *
     * Callback executed when the timer expires.
     * This method is triggered once the timer completes its countdown.
     * It is intended to contain the routines that should run after the timer finishes.
     */
    private onTimerExpired() {
        this.timer.set((this.timer() as TimerRunning).expire());
        this.audioService.playGhibliAlert();
        this.settings.commit();
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
