import { Component, signal, inject } from '@angular/core';
import { Dialog, DialogModule } from '@angular/cdk/dialog';

import { GremodoroSettings } from '../components/gremodoro-settings/gremodoro-settings';
import { GremodoroManager } from '../components/gremodoro-manager/gremodoro-manager';
import { TodoList } from '../components/todo-list/todo-list';
import { Timer } from '../components/timer/timer';
import { Icon } from '../components/icon/icon';

@Component({
    selector: 'app-gremodoro',
    imports: [DialogModule, Timer, GremodoroManager, Icon],
    templateUrl: './gremodoro.html',
    styleUrl: './gremodoro.scss',
})
export class Gremodoro {
    protected readonly title = signal('Gremodoro');
    private dialog = inject(Dialog);

    displaySettings() {
        this.dialog.open(GremodoroSettings, { minWidth: '320px', disableClose: true });
    }

    displayTodoList() {
        this.dialog.open(TodoList, { minWidth: '320px', disableClose: true });
    }
}
