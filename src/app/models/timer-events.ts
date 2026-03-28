/**
 * `TimerEvent`
 *
 * Describes an event object to be passed around the event bus.
 *
 * @event `TICK` indicates that a unit of time `delay` has been passed.
 * @event `TIMEOUT` indicates that the timer's duration zeroed.
 */
export type TimerEvent = { type: 'TICKED'; timeLeft: number } | { type: 'TIMEDOUT' };

/**
 * `TimerEventPublisher`
 *
 * A simple interface to propagate timer changes to a listener.
 */
export interface TimerEventPublisher {
    /**
     * `publish`
     * @param event Event to be propagated to a listener.
     */
    publish(event: TimerEvent): void;
}

/**
 * `TimerContext`
 *
 * A interface object describing the details of a timer.
 */
export interface TimerContext {
    initialTime: number;
    timeLeft: number;
    delay: number;
    publisher: TimerEventPublisher;
}
