import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';

import { Logger } from '../../services/logger';
import { GremodoroSettings as GremodoroSettingsService } from '../../services/gremodoro-settings';
import { GremodoroSettings as AppSettings } from '../../models/gremodoro-settings';
import { Icon } from '../icon/icon';

@Component({
    selector: 'app-gremodoro-settings',
    imports: [ReactiveFormsModule, Icon],
    templateUrl: './gremodoro-settings.html',
    styleUrl: './gremodoro-settings.scss',
})
export class GremodoroSettings {
    private logger = inject(Logger);
    private dialogRef = inject(DialogRef);
    private settings = inject(GremodoroSettingsService);

    /**
     * `settingsForm`
     *
     * Reactive form responsible for managing timer settings.
     *
     * @fields:
     * - focusTime: focus duration in minutes (min: 1, max: 120).
     * - shortBreak: short break duration in minutes (min: 1, max: 120).
     * - longBreak: long break duration in minutes (min: 1, max: 120).
     *
     * All fields are required (nonNullable) and initialized with values
     * from `currentSettings`.
     */
    settingsForm = new FormGroup({
        focusTime: new FormControl(this.settings.pendingSettings().focusTime, {
            nonNullable: true,
            validators: [Validators.min(1), Validators.max(120)],
        }),
        shortBreak: new FormControl(this.settings.pendingSettings().shortBreak, {
            nonNullable: true,
            validators: [Validators.min(1), Validators.max(120)],
        }),
        longBreak: new FormControl(this.settings.pendingSettings().longBreak, {
            nonNullable: true,
            validators: [Validators.min(1), Validators.max(120)],
        }),
    });

    /**
     * `save`
     *
     * Saves the form settings if they are valid.
     *
     * - Checks whether the form is valid.
     * - Persists the data using the `settings` service.
     * - Logs a message indicating success.
     * - Closes the dialog after saving.
     */
    save() {
        if (this.settingsForm.valid) {
            this.settings.saveSettings(this.settingsForm.getRawValue());
            this.logger.log('New settings saved!');
            this.close();
        }
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
