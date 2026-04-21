import { Routes } from '@angular/router';
import { Gremodoro } from './gremodoro/gremodoro';

export const routes: Routes = [
    { path: '', redirectTo: 'gremodoro', pathMatch: 'full' },
    { path: 'gremodoro', component: Gremodoro },
    { path: '**', redirectTo: 'gremodoro' },
];
