import { Component, DOCUMENT, inject, Inject, Renderer2 } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { Icon } from '../icon/icon';
import { TodoList as TodoListService } from '../../services/todo-list';
import { TaskList } from '../../models/task';

@Component({
    selector: 'app-todo-list',
    imports: [ReactiveFormsModule, DragDropModule, Icon],
    templateUrl: './todo-list.html',
    styleUrl: './todo-list.scss',
})
export class TodoList {
    private dialogRef = inject(DialogRef);
    tasksService = inject(TodoListService);

    taskInput = new FormControl('');

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2,
    ) {}

    /**
     * `onDragStart`
     *
     * Adds a global CSS class to the document body when a drag operation begins.
     * This ensures consistent styling, such as cursor behavior,
     * across the entire document during the drag interaction.
     */
    onDragStart() {
        this.renderer.addClass(this.document.body, 'is-global-dragging');
    }

    /**
     * `onDragEnd`
     *
     * Removes the global CSS class from the document body when a drag operation finishes.
     * This restores the document's default styling and pointer interactions.
     */
    onDragEnd() {
        this.renderer.removeClass(this.document.body, 'is-global-dragging');
    }

    /**
     * `onTaskDrop`
     *
     * Handles the drop event for task items. It reorders the tasks array based on
     * the drag interaction and updates the reactive state in the tasks service.
     *
     * @param event The drag and drop event.
     */
    onTaskDrop(event: CdkDragDrop<TaskList>) {
        const tasks = [...this.tasksService.tasks()];

        moveItemInArray(tasks, event.previousIndex, event.currentIndex);

        this.tasksService.tasks.set(tasks);
        this.tasksService.saveTasks();
    }

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
