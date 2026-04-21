import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { GremodoroSettings as AppSettings, DEFAULT_SETTINGS } from '../models/gremodoro-settings';

/**
 * `GremodoroSettings`
 *
 * This service can be used for loading and saving the application's settings from/to `localStorage`.
 */
@Injectable({
    providedIn: 'root',
})
export class GremodoroSettings {
    private platformID = inject(PLATFORM_ID);
    pendingSettings = signal<AppSettings>(this.loadFromStorage());
    settings = signal<AppSettings>(this.loadFromStorage());

    /**
     * `saveSettings`
     *
     * Saves the application's settings, it updates and overwrites any settings already in place.
     *
     * @param newSettings
     */
    saveSettings(newSettings: AppSettings) {
        if (!isPlatformBrowser(this.platformID)) {
            return;
        }

        this.pendingSettings.set(newSettings);
        localStorage.setItem('gremodoro-settings', JSON.stringify(newSettings));
    }

    /**
     * `commit`
     *
     * Commits the pending settings.
     * Settings are not applied directly, instead this function should be called so they take effect.
     */
    commit() {
        this.settings.set(this.pendingSettings());
    }

    /**
     * `loadFromStorage`
     *
     * Tries to load the application's settings from disk, if it fails, it uses the `DEFAULT_SETTINGS`.
     *
     * @returns `AppSettings` application's settings.
     */
    private loadFromStorage(): AppSettings {
        if (!isPlatformBrowser(this.platformID)) {
            return DEFAULT_SETTINGS;
        }

        const saved = localStorage.getItem('gremodoro-settings');

        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                /** Deliberately empty
                 *
                 * Just ignore it and use the default settings.
                 */
            }
        }
        return DEFAULT_SETTINGS;
    }
}
