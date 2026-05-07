import { Component, inject, signal, effect, untracked } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Icon } from '../icon/icon';
import { TimerMode, factoryMode } from '../../models/timer-modes';
import { TimerExpired, TimerIdle } from '../../models/timer-states';
import { Timer as TimerService } from '../../services/timer';
import { GremodoroSettings } from '../../services/gremodoro-settings';
import { formatTime } from '../../shared/utils/time.utils';

@Component({
    selector: 'app-gremodoro-manager',
    imports: [Icon],
    templateUrl: './gremodoro-manager.html',
    styleUrl: './gremodoro-manager.scss',
})
export class GremodoroManager {
    private timerService = inject(TimerService);
    private settings = inject(GremodoroSettings);
    private titleService = inject(Title);

    gremodorosCount = signal<number>(0);
    shortBreaksCount = signal<number>(0);
    longBreaksCount = signal<number>(0);
    currentMode = signal<TimerMode>(factoryMode.focusTimeMode(0));
    isStatsOpen = signal<boolean>(false);

    constructor() {
        effect(() => {
            this.countModeChanges();
        });

        effect(() => {
            this.updateTitle();
        });

        effect(() => {
            this.commitPendingSettings();
        });
    }

    /**
     * `updateTitle`
     *
     * Updates the page's title based on the current time on the timer.
     * If the timer is idled, only the application name is used.
     */
    private updateTitle() {
        const seconds = this.timerService.timeLeft();
        const mode = {
            focusTime: 'Focus Time',
            shortBreak: 'Short Break',
            longBreak: 'Long Break',
        }[this.currentMode().type];

        if (!(this.timerService.timer() instanceof TimerIdle)) {
            this.titleService.setTitle(`${formatTime(seconds)} - ${mode} | Gremodoro`);
        } else {
            this.titleService.setTitle('Gremodoro');
        }
    }

    /**
     * `countModeChanges`
     *
     * Calculates the number of Pomodoros and breaks, and based on that, set the next timer mode.
     *
     * Eg. at each completed Pomodoro automatically changes to a short break
     * and at each 4 completed Pomodoros automatically changes to a long break.
     *
     * After a break is completed, the mode changes back to focus mode.
     */
    private countModeChanges() {
        if (this.timerService.timer() instanceof TimerExpired) {
            switch (this.currentMode().type) {
                case 'focusTime': {
                    this.gremodorosCount.update((v) => v + 1);
                    if (!(this.gremodorosCount() % 4 === 0)) {
                        this.shortBreakMode();
                        return;
                    }
                    this.longBreakMode();
                    break;
                }
                case 'shortBreak': {
                    this.shortBreaksCount.update((v) => v + 1);
                    this.focusTimeMode();
                    break;
                }
                case 'longBreak': {
                    this.longBreaksCount.update((v) => v + 1);
                    this.focusTimeMode();
                    break;
                }
            }
        }
    }

    /**
     * `commitPendingSettings`
     *
     * Only commits the pending settings (settings that were just changed but couldn't be applied yet)
     * if the timer is either idled or expired (this helps not overwrite a current running timer).
     */
    private commitPendingSettings() {
        const pending = this.settings.pendingSettings();
        const currentState = this.timerService.timer();
        const currentMode = this.currentMode();
        const active = this.settings.settings();

        if (pending === active) {
            return;
        }

        if (!(currentState instanceof TimerIdle || currentState instanceof TimerExpired)) {
            return;
        }

        this.settings.commit();

        switch (currentMode.type) {
            case 'focusTime': {
                this.timerService.setupTimer(this.settings.settings().focusTime * 60);
                break;
            }
            case 'shortBreak': {
                this.timerService.setupTimer(this.settings.settings().shortBreak * 60);
                break;
            }
            case 'longBreak': {
                this.timerService.setupTimer(this.settings.settings().longBreak * 60);
                break;
            }
        }
    }

    /**
     * `setMode`
     *
     * A helper to set the current mode.
     * Possible modes are: `focusTimeMode`, `shortBreakMode` and `longBreakMode`.
     */
    private setMode(mode: TimerMode) {
        this.currentMode.set(mode);
        this.timerService.setupTimer(mode.duration);
    }

    focusTimeMode() {
        this.setMode(factoryMode.focusTimeMode(this.settings.settings().focusTime * 60));
    }

    shortBreakMode() {
        this.setMode(factoryMode.shortBreakMode(this.settings.settings().shortBreak * 60));
    }

    longBreakMode() {
        this.setMode(factoryMode.longBreakMode(this.settings.settings().longBreak * 60));
    }

    /**
     * `toggleStats`
     *
     * A simple toggle to open or close the status tab.
     */
    toggleStats() {
        this.isStatsOpen.update((v) => !v);
    }
}
