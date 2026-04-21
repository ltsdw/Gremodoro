import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Task, TaskList } from '../models/task';

@Injectable({
    providedIn: 'root',
})
export class TodoList {
    private platformID = inject(PLATFORM_ID);
    private readonly STORAGE_KEY = 'todo-list';
    tasks = signal<TaskList>(this.loadFromStorage());

    /**
     * `addTask`
     *
     * Creates and adds a new task based on the current input value.
     * Also persists the updated list to localStorage.
     *
     * @param text The description of the new task.
     */
    saveTask(text: string) {
        if (!text) {
            return;
        }

        const newTask: Task = {
            id: crypto.randomUUID(),
            description: text,
            completed: false,
        };

        this.tasks.update((xs) => {
            const updated = [...xs, newTask];
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }

    /**
     * `toggleTask`
     *
     * Toggles the completion state of a task by its unique identifier.
     * Also persists the updated list to localStorage.
     *
     * @param id The unique identifier of the task to toggle.
     */
    toggleTask(id: string) {
        this.tasks.update((xs) => {
            const updated = xs.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }

    /**
     * `removeTask`
     *
     * Removes a task from the list by its unique identifier.
     * Also persists the updated list to localStorage.
     *
     * @param id The unique identifier of the task to be removed.
     */
    removeTask(id: string) {
        this.tasks.update((xs) => {
            const updated = xs.filter((t) => t.id !== id);

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }

    /**
     * `saveToStorage`
     *
     * Persists the current task list into localStorage.
     */
    saveTasks() {
        if (!isPlatformBrowser(this.platformID)) {
            return;
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks()));
    }

    /**
     * `loadFromStorage`
     *
     * Loads the task list from localStorage.
     * Returns an empty array if no data is found or parsing fails.
     */
    private loadFromStorage(): TaskList {
        if (!isPlatformBrowser(this.platformID)) {
            return [];
        }

        const saved = localStorage.getItem(this.STORAGE_KEY);

        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                /** Deliberately empty
                 *
                 * Just ignore it and use an empty array.
                 */
            }
        }
        return [];
    }
}
