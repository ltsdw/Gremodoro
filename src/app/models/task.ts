/**
 * `Task`
 *
 * Represents a single task item in the system.
 *
 * A task contains a unique identifier, a textual description, and a flag indicating whether it has been completed.
 */
export interface Task {
    id: string;
    description: string;
    completed: boolean;
}

/**
 * `TaskList`
 *
 * A type alias for an array of `Tasks` .
 */
export type TaskList = Task[];
