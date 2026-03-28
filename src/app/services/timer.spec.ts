import { TestBed } from '@angular/core/testing';

import { Timer } from './timer';
import { Logger } from './logger';
import { TimerIdle, TimerRunning, TimerPaused, TimerExpired } from '../models/timer-states';

describe('Timer', () => {
    let service: Timer;
    const mockLogger = {
        log: vitest.fn(),
        warn: vitest.fn(),
        error: vitest.fn(),
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Timer, { provide: Logger, useValue: mockLogger }],
        });
        service = TestBed.inject(Timer);

        vitest.clearAllMocks();
        vitest.useFakeTimers();
    });

    afterEach(() => {
        vitest.useRealTimers();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should start at the state TimerIdle', () => {
        expect(service.timer() instanceof TimerIdle).toBeTruthy();
    });

    it('should transitions to the TimerRunning state when startTimer() is called from TimerIdle state', () => {
        service.startTimer();
        expect(service.timer() instanceof TimerRunning).toBeTruthy();
    });

    it('should NOT start again if already in TimerRunning state. Also should log error', () => {
        service.startTimer();
        service.startTimer();

        expect(service.timer() instanceof TimerRunning).toBeTruthy();
        expect(mockLogger.error).toHaveBeenCalledWith(
            'Cannot start the timer. Timer state is not Idle or Paused.',
            expect.any(Function),
        );
    });

    it('should NOT pause if the state IS NOT TimerRunning. Also should log error', () => {
        service.pauseTimer();

        expect(service.timer() instanceof TimerIdle).toBeTruthy();
        expect(mockLogger.error).toHaveBeenCalledWith(
            'Cannot pause the timer. Timer state is not Running.',
            expect.any(Function),
        );
    });

    it('should NOT change state and keep at the TimerIdle state. Also should log', () => {
        service.resetTimer();

        expect(service.timer() instanceof TimerIdle).toBeTruthy();
        expect(mockLogger.log).toHaveBeenCalledWith('Timer is already Idle.', expect.any(Function));
    });

    it('should change the state from TimerRunning to TimerPaused', () => {
        service.startTimer();
        service.pauseTimer();
        expect(service.timer() instanceof TimerPaused).toBeTruthy();
    });

    it('should reset the timer to its initial state', () => {
        service.startTimer();

        expect(service.timer() instanceof TimerRunning).toBeTruthy();

        service.resetTimer();

        expect(service.timer() instanceof TimerIdle).toBeTruthy();

        service.startTimer();
        service.pauseTimer();

        expect(service.timer() instanceof TimerPaused).toBeTruthy();

        service.resetTimer();

        expect(service.timer() instanceof TimerIdle).toBeTruthy();
    });

    it('should change the state from TimerRunning to TimerExpired', () => {
        service.startTimer();

        expect(service.timer() instanceof TimerRunning).toBeTruthy();

        vitest.advanceTimersByTime(1500 * 1000);

        expect(service.timer() instanceof TimerExpired).toBeTruthy();
    });

    it('should NOT change the state from TimerRunning to TimerExpired', () => {
        service.startTimer();

        expect(service.timer() instanceof TimerRunning).toBeTruthy();

        vitest.advanceTimersByTime(1499 * 1000);

        expect(service.timer() instanceof TimerExpired).toBeFalsy();
    });
});
