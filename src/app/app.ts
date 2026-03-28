import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Timer } from './components/timer/timer';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Timer],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected readonly title = signal('Gremodoro');
}
