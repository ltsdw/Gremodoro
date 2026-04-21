import { Component, inject, computed } from '@angular/core';

import { TimerIdle, TimerRunning, TimerPaused, TimerExpired } from '../../models/timer-states';
import { Timer as TimerService } from '../../services/timer';
import { TimeFormatPipe } from '../../pipes/time-format-pipe';
import { Icon } from '../icon/icon';
import { Audio } from '../../services/audio';

@Component({
    selector: 'app-timer',
    imports: [TimeFormatPipe, Icon],
    templateUrl: './timer.html',
    styleUrl: './timer.scss',
})
export class Timer {
    timerService = inject(TimerService);
    audioService = inject(Audio);

    private readonly CIRCUMFERENCE = 2 * Math.PI * 140;

    /**
     * `offset`
     *
     * @return A representation of the timer progress as an offset to its progress circle.
     *
     */
    offset = computed((): number => {
        const current = this.timerService.timeLeft();
        const initial = this.timerService.initialTime();

        if (initial === 0) return this.CIRCUMFERENCE;

        const fraction = current / initial;

        return -(this.CIRCUMFERENCE - fraction * this.CIRCUMFERENCE);
    });

    /**
     * `isIdle`
     *
     * @return True when the timer is idled.
     */
    isIdle = computed((): boolean => {
        return this.timerService.timer() instanceof TimerIdle;
    });

    /**
     * `isRunning`
     *
     * @return True when the timer is running.
     */
    isRunning = computed((): boolean => {
        return this.timerService.timer() instanceof TimerRunning;
    });

    /**
     * `isPaused`
     *
     * @return True when the timer is paused.
     */
    isPaused = computed((): boolean => {
        return this.timerService.timer() instanceof TimerPaused;
    });

    /**
     * `isExpired`
     *
     * @return True when the timer expires.
     */
    isExpired = computed((): boolean => {
        return this.timerService.timer() instanceof TimerExpired;
    });

    /**
     * `canSensitivePlayBtn`
     *
     * Tells whether the play button should have its sensitive enabled or disabled.
     * The button is disabled if its state is running state.
     *
     * @return True for any timer state other than running.
     *
     */
    canSensitivePlayBtn = computed((): boolean => {
        return !(this.isRunning() || this.isExpired());
    });

    /**
     * `canSensitivePauseBtn`
     *
     * Tells whether the pause button should have its sensitive enabled or disabled.
     * The button is disabled if its state is not running state.
     *
     * @return True when the timer state is the running state.
     *
     */
    canSensitivePauseBtn = computed((): boolean => {
        return this.isRunning();
    });

    /**
     * `canSensitiveResetBtn`
     *
     * Tells whether the reset button should have its sensitive enabled or disabled.
     * The button is disabled if its state is not idled state.
     *
     * @return True for any timer state other than the idled state.
     *
     */
    canSensitiveResetBtn = computed((): boolean => {
        return !this.isIdle();
    });
}
