import { Component, inject } from '@angular/core';

import { TimerIdle, TimerRunning, TimerPaused, TimerExpired } from '../../models/timer-states';
import { Timer as TimerService } from '../../services/timer';
import { TimeFormatPipe } from '../../pipes/time-format-pipe';

@Component({
    selector: 'app-timer',
    imports: [TimeFormatPipe],
    templateUrl: './timer.html',
    styleUrl: './timer.scss',
})
export class Timer {
    timerService = inject(TimerService);

    isIdle() {
        return this.timerService.timer() instanceof TimerIdle;
    }

    isRunning() {
        return this.timerService.timer() instanceof TimerRunning;
    }

    isPaused() {
        return this.timerService.timer() instanceof TimerPaused;
    }

    isExpired() {
        return this.timerService.timer() instanceof TimerExpired;
    }
}
