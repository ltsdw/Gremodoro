import { Component, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { Icon } from '../icon/icon';
import { TodoList as TodoListService } from '../../services/todo-list';

@Component({
    selector: 'app-todo-list',
    imports: [ReactiveFormsModule, Icon],
    templateUrl: './todo-list.html',
    styleUrl: './todo-list.scss',
})
export class TodoList {
    private dialogRef = inject(DialogRef);
    tasksService = inject(TodoListService);

    taskInput = new FormControl('');

    /**
     * `addTask`
     *
     * Creates and adds a new task based on the current input value.
     */
    addTask() {
        const text = this.taskInput.value?.trim();

        if (!text) {
            return;
        }

        this.tasksService.saveTask(text);
        this.taskInput.reset();
    }

    /**
     * `toggleTask`
     *
     * Toggles the completion state of a task by its unique identifier.
     *
     * @param id The unique identifier of the task to toggle.
     */
    toggleTask(id: string) {
        this.tasksService.toggleTask(id);
    }

    /**
     * `removeTask`
     *
     * Removes a task from the list by its unique identifier.
     *
     * @param id The unique identifier of the task to be removed.
     */
    removeTask(id: string) {
        this.tasksService.removeTask(id);
    }

    /**
     * `close`
     *
     * Closes the settings dialog.
     *
     * Uses the dialog reference (`dialogRef`) to close the modal.
     */
    close() {
        this.dialogRef.close();
    }
}
