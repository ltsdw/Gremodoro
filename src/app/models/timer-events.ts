import { Brand } from './brand';

/**
 * `TimerEvent`
 *
 * Describes an event object to be passed around the event bus.
 *
 * @event `TickedEvent` indicates that a unit of time `delay` has been passed.
 * @event `ExpiredEvent` indicates that the timer's duration zeroed.
 */
export type TimerEvent = TickedEvent | ExpiredEvent;
export type TickedEvent = Brand<{ type: 'ticked'; timeLeft: number }, 'TimerEvent'>;
export type ExpiredEvent = Brand<{ type: 'expired' }, 'TimerEvent'>;

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

/**
 * `factoryEvent`
 *
 * A namaspace for holding factories to create objects of the desired type offered by this model.
 */
export const factoryEvent = {
    tickedEvent(timeLeft: number): TickedEvent {
        return { type: 'ticked', timeLeft: timeLeft } as TickedEvent;
    },
    expiredEvent(): ExpiredEvent {
        return { type: 'expired' } as ExpiredEvent;
    },
};
