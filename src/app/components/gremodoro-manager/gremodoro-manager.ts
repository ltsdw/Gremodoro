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
    }

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

    toggleStats() {
        this.isStatsOpen.update((v) => !v);
    }
}
