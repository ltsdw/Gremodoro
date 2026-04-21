import { TestBed } from '@angular/core/testing';
import { Mock } from 'vitest';

import { GremodoroSettings, DEFAULT_SETTINGS } from '../models/gremodoro-settings';
import { GremodoroSettings as GremodoroSettingsService } from './gremodoro-settings';

describe('GremodoroSettings', () => {
    let getItemSpy: Mock;
    let setItemSpy: Mock;
    const customSettings: GremodoroSettings = { focusTime: 50, shortBreak: 10, longBreak: 20 };

    beforeEach(() => {
        getItemSpy = vitest.spyOn(Storage.prototype, 'getItem');
        setItemSpy = vitest.spyOn(Storage.prototype, 'setItem');
        vitest.clearAllMocks();
    });

    afterEach(() => {
        vitest.restoreAllMocks();
    });

    /**
     * `setupService`
     *
     * This function is for not constructing the service as soon as the tests starts running,
     * otherwise the default settings would always be chosen. For the sake of testing,
     * this function allows to be able to delay the instantiation.
     *
     * @returns GremodoroSettingsService
     */
    const setupService = (): GremodoroSettingsService => {
        TestBed.configureTestingModule({ providers: [GremodoroSettingsService] });
        return TestBed.inject(GremodoroSettingsService);
    };

    it('should be created', () => {
        const service = setupService();

        expect(service).toBeTruthy();
    });

    it('should use the default configuration if the localStorage is empty', () => {
        getItemSpy.mockReturnValue(null);
        const service = setupService();

        expect(getItemSpy).toHaveBeenCalledWith('gremodoro-settings');
        expect(service.settings()).toEqual(DEFAULT_SETTINGS);
    });

    it('should load the settings from localStorage if they exist.', () => {
        getItemSpy.mockReturnValue(JSON.stringify(customSettings));

        const service = setupService();

        expect(service.settings()).toEqual(customSettings);
    });

    it('should fallback to the default settings if the JSON from localStorage is malformed', () => {
        getItemSpy.mockReturnValue('{ foo_bar }');

        const service = setupService();

        expect(service.settings()).toEqual(DEFAULT_SETTINGS);
    });

    it('should update the Signal and save the custom settings to localStorage when saveSettings() is called.', () => {
        getItemSpy.mockReturnValue(null);

        const service = setupService();

        service.saveSettings(customSettings);

        expect(service.settings()).toEqual(customSettings);
        expect(setItemSpy).toHaveBeenCalledWith(
            'gremodoro-settings',
            JSON.stringify(customSettings),
        );
    });
});
