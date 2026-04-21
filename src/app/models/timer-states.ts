import { TimerEventPublisher, TimerContext, factoryEvent } from './timer-events';

/**
 * `TimerState`
 *
 * A abstract class that represents the states of a `Timer`.
 */
export abstract class TimerState {
    constructor(protected ctx: TimerContext) {}

    /**
     * `getTimeLeft`
     *
     * Returns the time left in the timer.
     *
     * @returns Time left.
     */
    getTimeLeft(): number {
        return this.ctx.timeLeft;
    }

    /**
     * `getTime`
     *
     * Returns the duration the timer was initially set to.
     *
     * @returns Timer's time.
     */
    getTime(): number {
        return this.ctx.initialTime;
    }

    /**
     * `reset`
     *
     * Creates a new instance of `TimerIdle`.
     * Transitions from `TimerRunning` state to `TimerIdle` state, resetting the timer.
     * `TimerIdle` is the initial state of a timer.
     *
     * @returns `TimerIdle`
     */
    reset(): TimerIdle {
        this.ctx.timeLeft = this.ctx.initialTime;
        this.ctx.publisher.publish(factoryEvent.tickedEvent(this.ctx.timeLeft));
        return new TimerIdle(this.ctx);
    }

    /**
     * `destroy`
     *
     * Cleanup any allocated resource and or state internal state.
     */
    destroy(): void {}
}

/**
 * `TimerIdle`
 *
 * This is the state when the timer is in idle state (not initialized yet).
 *
 * This state is able to change TO:
 *  `TimerIdle` -> `TimerRunning`
 */
export class TimerIdle extends TimerState {
    /**
     * Creates a new instance of the `TimerIdle`.
     *
     * @param time The number in seconds of the duration of the timer.
     * @param callback A callback to signal the time left at every `delay` milliseconds.
     * This callback is called passing the time left in the timer as its `time` parameter.
     * @param delay The number of delay in milliseconds before calling the `callback`. **Default:** `1`.
     */
    constructor(ctx: TimerContext) {
        super(ctx);
    }

    /**
     * `start`
     *
     * Creates a new instance of the `TimerRunning`.
     * Transitions from the `TimerIdle` state to `TimerRunning` state, starting the timer.
     *
     * @returns `TimerRunning`
     */
    start(): TimerRunning {
        return new TimerRunning(this.ctx);
    }
}

/**
 * `TimerRunning`
 *
 * This is the state when the timer changes FROM:
 *  `TimerIdle` -> `TimerRunning`
 *  `TimerPaused` -> `TimerRunning`
 *
 * This state is able to change TO:
 *  `TimerRunning` -> `TimerPaused`
 *  `TimerRunning` -> `TimerIdle`
 */
export class TimerRunning extends TimerState {
    private intervalId: ReturnType<typeof setInterval>;

    /**
     * Creates a new instance of the `TimerRunning`.
     *
     * @param ctx A `TimerContext` object describing the details of the timer.
     */
    constructor(ctx: TimerContext) {
        super(ctx);
        this.intervalId = this.setTicking();
    }

    /**
     * `pause`
     *
     * Creates a new instance of `TimerPaused`.
     * Transitions from `TimerRunning` state to `TimerPaused` state, pausing the timer.
     *
     * @returns `TimerPaused`
     *
     */
    pause(): TimerPaused {
        clearInterval(this.intervalId);
        return new TimerPaused(this.ctx);
    }

    /**
     * `expire`
     *
     * Creates a new instance of `TimerExpired`.
     * Transitions from `TimerRunning` state to `TimerExpired` state.
     *  `TimerExpired` is the last state of a timer, when the timer reaches the end of its set duration.
     *
     * @returns `TimerExpired`
     */
    expire(): TimerExpired {
        clearInterval(this.intervalId);
        return new TimerExpired(this.ctx);
    }

    override reset(): TimerIdle {
        clearInterval(this.intervalId);
        this.ctx.timeLeft = this.ctx.initialTime;
        this.ctx.publisher.publish(factoryEvent.tickedEvent(this.ctx.timeLeft));
        return new TimerIdle(this.ctx);
    }

    /**
     * `setTicking` Sets up the timer's ticking rate in `TimerContext.delay` milliseconds.
     *
     * @returns `setInterval`
     */
    private setTicking(): ReturnType<typeof setInterval> {
        return setInterval(() => {
            if (this.ctx.timeLeft > 0) {
                this.ctx.timeLeft--;
                this.ctx.publisher.publish(factoryEvent.tickedEvent(this.ctx.timeLeft));

                if (this.ctx.timeLeft === 0) {
                    clearInterval(this.intervalId);
                    this.ctx.publisher.publish(factoryEvent.expiredEvent());
                }
            }
        }, this.ctx.delay);
    }

    override destroy() {
        clearInterval(this.intervalId);
    }
}

/**
 * `TimerPaused`
 *
 * This is the state when the timer changes FROM:
 *
 *  `TimerRunning` -> `TimerPaused`
 *
 * This state is able to change TO:
 *  `TimerPaused` -> `TimerRunning`
 *  `TimerPaused` -> `TimerIdle`
 */
export class TimerPaused extends TimerState {
    /**
     * Creates a new instance of the `TimerPaused`.
     *
     * @param ctx A `TimerContext` object describing the details of the timer.
     */
    constructor(ctx: TimerContext) {
        super(ctx);
    }

    /**
     * `start`
     *
     * Creates a new instance of `TimerRunning`.
     * Transitions from the `TimerPaused` state to `TimerRunning` state, resuming the timer.
     *
     * @returns `TimerRunning`
     */
    start(): TimerRunning {
        return new TimerRunning(this.ctx);
    }
}

/**
 * `TimerExpired`
 *
 * This is the state when the timer changes FROM:
 *  `TimerRunning` -> `TimerExpired`
 *
 * This state is able to change TO:
 *  `TimerExpired` -> `TimerIdle`
 *
 * `TimerExpired` is the last state of a timer, when the timer reaches the end of its set duration.
 */
export class TimerExpired extends TimerState {
    /**
     * Creates a new instance of the `TimerExpired`.
     *
     * @param timeLeft The number in seconds the still have left.
     * @param callback A callback to signal the time left at every `delay` milliseconds.
     * This callback is called passing the time left in the timer as its `time` parameter.
     * @param delay The number of delay in milliseconds before calling the `callback`. **Default:** `1`.
     */
    constructor(ctx: TimerContext) {
        super(ctx);
    }
}

/**
 * `getNewTimer`
 *
 * Returns a initialized, but idled, timer.
 *
 * @param time The time the timer will have.
 * @param publisher A `TimerEventPublisher` to propagate events to a listener.
 * The publisher keeps the listener updated about time changes.
 * @param delay The number of delay in milliseconds before `ticking`, it's the rate the timer ticks. **Default:** `1`.
 *
 * @returns `TimerIdle`
 */
export const getNewTimer = (
    time: number,
    publisher: TimerEventPublisher,
    delay: number = 1,
): TimerIdle => {
    return getTimerWithContext({
        initialTime: time,
        timeLeft: time,
        publisher: publisher,
        delay: delay,
    });
};

/**
 * `getTimerWithContext`
 *
 * Returns a new timer with internal details based on the context passed.
 *
 * @param interface object describing the details of a timer.
 *
 * @returns `TimerIdle`
 */
export const getTimerWithContext = (timerContext: TimerContext): TimerIdle => {
    return new TimerIdle(timerContext);
};
